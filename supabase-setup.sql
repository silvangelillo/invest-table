-- ============================================================
-- InvestTable — Complete Supabase Setup
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES (linked to auth.users)
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('investor', 'startup')) default 'investor',
  full_name   text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
-- Uses EXCEPTION so a trigger failure never blocks auth.users insert
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'investor'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- Log the error but never block the auth transaction
    raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Drop and recreate trigger to avoid duplicate trigger errors
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 3. INVESTOR ORGANIZATIONS
create table if not exists investor_organizations (
  id                     uuid primary key default uuid_generate_v4(),
  name                   text not null,
  stripe_customer_id     text,
  stripe_subscription_id text,
  purchased_seats        int not null default 1,
  created_at             timestamptz default now()
);

-- 4. INVESTOR USERS
create table if not exists investor_users (
  id                 uuid primary key default uuid_generate_v4(),
  profile_id         uuid references profiles(id) on delete cascade,
  organization_id    uuid references investor_organizations(id),
  email              text unique not null,
  role               text not null check (role in ('admin','member')) default 'admin',
  seat_status        text not null check (seat_status in ('active','inactive')) default 'active',
  session_token_hash text,
  last_login_at      timestamptz,
  created_at         timestamptz default now()
);

-- 5. INVESTOR SESSIONS (anti-sharing)
create table if not exists investor_sessions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references investor_users(id) on delete cascade,
  token_hash text not null,
  ip_address text,
  active     boolean default true,
  created_at timestamptz default now()
);

-- 6. STARTUPS
create table if not exists startups (
  id                         uuid primary key default uuid_generate_v4(),
  profile_id                 uuid references profiles(id) on delete cascade,
  name                       text not null,
  tagline                    text,
  short_description          text check (char_length(short_description) <= 500),
  category                   text not null check (category in ('Tech','Food','Service','Sustainability')),
  secondary_categories       text[] default '{}',
  city                       text not null,
  country                    text not null,
  lat                        double precision not null,
  lng                        double precision not null,
  website_url                text,
  email                      text,
  pitch_deck_url             text,
  gdpr_compliant             boolean default false,
  founded_year               int,
  team_size                  int,
  employee_count             int check (employee_count >= 0),
  funding_stage              text check (funding_stage in ('Pre-seed','Seed','Series A','Series B+')),
  pricing_tier               text not null check (pricing_tier in ('core','plus','ultra')) default 'core',
  tier_started_at            timestamptz,
  stripe_subscription_id     text,
  revenue_last_12m           numeric check (revenue_last_12m >= 0),
  revenue_cagr_3y            numeric check (revenue_cagr_3y >= -100 and revenue_cagr_3y <= 300),
  verified_financials        boolean default false,
  profile_completeness_score int default 0,
  ranking_score              numeric default 0,
  heart_count                int default 0,
  approved                   boolean default false,
  created_at                 timestamptz default now()
);

-- 7. SAVED SEARCHES
create table if not exists saved_searches (
  id             uuid primary key default uuid_generate_v4(),
  investor_id    uuid references profiles(id) on delete cascade,
  label          text not null,
  filters        jsonb not null default '{}',
  alerts_enabled boolean default false,
  created_at     timestamptz default now()
);

-- 8. FAVORITES
create table if not exists favorites (
  id               uuid primary key default uuid_generate_v4(),
  investor_id      uuid references profiles(id) on delete cascade,
  startup_id       uuid references startups(id) on delete cascade,
  created_at       timestamptz default now(),
  unique(investor_id, startup_id)
);

-- Auto-update heart_count on favorites change
create or replace function update_heart_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update startups set heart_count = heart_count + 1 where id = NEW.startup_id;
  elsif TG_OP = 'DELETE' then
    update startups set heart_count = greatest(0, heart_count - 1) where id = OLD.startup_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger favorites_heart_count
  after insert or delete on favorites
  for each row execute function update_heart_count();

-- 9. NOTIFICATIONS
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  investor_id uuid references profiles(id) on delete cascade,
  title       text not null,
  body        text not null,
  startup_id  uuid references startups(id),
  read        boolean default false,
  created_at  timestamptz default now()
);

-- 10. AUDIT LOGS
create table if not exists audit_logs (
  id         uuid primary key default uuid_generate_v4(),
  actor_id   uuid not null,
  action     text not null,
  target_id  uuid,
  metadata   jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles           enable row level security;
alter table investor_users     enable row level security;
alter table investor_organizations enable row level security;
alter table startups           enable row level security;
alter table saved_searches     enable row level security;
alter table favorites          enable row level security;
alter table notifications      enable row level security;
alter table audit_logs         enable row level security;

-- Profiles: users see only their own
create policy "profiles: own" on profiles
  for all using (auth.uid() = id);

-- Startups: approved ones visible to all, own startup always visible
create policy "startups: approved visible to all" on startups
  for select using (approved = true);

create policy "startups: own startup always visible" on startups
  for all using (auth.uid() = profile_id);

-- Saved searches: own only
create policy "saved_searches: own" on saved_searches
  for all using (auth.uid() = investor_id);

-- Favorites: own only
create policy "favorites: own" on favorites
  for all using (auth.uid() = investor_id);

-- Notifications: own only
create policy "notifications: own" on notifications
  for all using (auth.uid() = investor_id);

-- ============================================================
-- STORAGE SETUP
-- ============================================================
-- Run these in Supabase Dashboard → Storage → New Bucket:
--
-- Bucket name: pitch-decks
-- Public: NO (private)
-- File size limit: 20MB
-- Allowed MIME types: application/pdf
--
-- Then add this RLS policy for the bucket:
-- "Authenticated users can upload their own pitch deck"
-- "Investors with active Plus/Pro can read pitch decks"

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pitch-decks',
  'pitch-decks',
  false,
  20971520, -- 20MB in bytes
  array['application/pdf']
) on conflict (id) do nothing;

-- Storage RLS: startups can upload/update their own deck
create policy "pitch-decks: startups upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'pitch-decks' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "pitch-decks: startups read own"
  on storage.objects for select
  using (
    bucket_id = 'pitch-decks' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated investors can read all pitch decks
create policy "pitch-decks: investors read"
  on storage.objects for select
  using (
    bucket_id = 'pitch-decks' and
    auth.role() = 'authenticated'
  );

-- ============================================================
-- PLATFORM STATS (for counter — only shows when threshold met)
-- ============================================================
create or replace view platform_stats as
select
  count(*) filter (where approved = true)            as startup_count,
  count(distinct country) filter (where approved = true) as country_count,
  sum(heart_count)                                   as total_hearts
from startups;
