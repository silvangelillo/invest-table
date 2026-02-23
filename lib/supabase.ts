import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "https://mock.supabase.co";
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "mock-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Full Database Schema SQL ─────────────────────────────────────────────────
// Run this in your Supabase SQL editor
export const SCHEMA_SQL = `
create extension if not exists "uuid-ossp";

-- Investor Organizations (seat-based)
create table if not exists investor_organizations (
  id                      uuid primary key default uuid_generate_v4(),
  name                    text not null,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  purchased_seats         int not null default 1,
  created_at              timestamptz default now()
);

-- Investor Users (members of an org, each consuming a seat)
create table if not exists investor_users (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid references investor_organizations(id) on delete cascade,
  email               text unique not null,
  role                text not null check (role in ('admin','member')) default 'member',
  seat_status         text not null check (seat_status in ('active','inactive')) default 'inactive',
  session_token_hash  text,
  last_login_at       timestamptz,
  created_at          timestamptz default now()
);

-- Investor sessions (anti-sharing monitor)
create table if not exists investor_sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references investor_users(id) on delete cascade,
  token_hash  text not null,
  ip_address  text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Startups (extended)
create table if not exists startups (
  id                        uuid primary key default uuid_generate_v4(),
  name                      text not null,
  tagline                   text,
  short_description         text check (char_length(short_description) <= 500),
  category                  text not null check (category in ('Tech','Food','Service','Sustainability')),
  secondary_categories      text[] default '{}',
  city                      text not null,
  country                   text not null,
  lat                       double precision not null,
  lng                       double precision not null,
  pitch_deck_url            text,
  gdpr_compliant            boolean default false,
  founded_year              int,
  team_size                 int,
  employee_count            int check (employee_count >= 0),
  funding_stage             text check (funding_stage in ('Pre-seed','Seed','Series A','Series B+')),
  pricing_tier              text not null check (pricing_tier in ('core','plus','ultra')) default 'core',
  tier_started_at           timestamptz,
  website_url               text,
  revenue_last_12m          numeric check (revenue_last_12m >= 0),
  revenue_cagr_3y           numeric check (revenue_cagr_3y >= -100 and revenue_cagr_3y <= 300),
  verified_financials       boolean default false,
  profile_completeness_score int default 0,
  ranking_score             numeric default 0,
  heart_count               int default 0,
  investor_id               uuid,
  created_at                timestamptz default now()
);

-- Saved searches
create table if not exists saved_searches (
  id              uuid primary key default uuid_generate_v4(),
  investor_id     uuid,
  label           text not null,
  filters         jsonb not null default '{}',
  alerts_enabled  boolean default false,
  created_at      timestamptz default now()
);

-- Favorites (heart system)
create table if not exists favorites (
  id                uuid primary key default uuid_generate_v4(),
  investor_user_id  uuid references investor_users(id) on delete cascade,
  startup_id        uuid references startups(id) on delete cascade,
  created_at        timestamptz default now(),
  unique(investor_user_id, startup_id)
);

-- Notifications
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  investor_id uuid,
  title       text not null,
  body        text not null,
  startup_id  uuid references startups(id),
  read        boolean default false,
  created_at  timestamptz default now()
);

-- Audit logs
create table if not exists audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  actor_id    uuid not null,
  action      text not null,
  target_id   uuid not null,
  metadata    jsonb default '{}',
  created_at  timestamptz default now()
);

-- Row-Level Security
alter table investor_organizations enable row level security;
alter table investor_users         enable row level security;
alter table startups               enable row level security;
alter table saved_searches         enable row level security;
alter table favorites              enable row level security;
alter table notifications          enable row level security;
alter table audit_logs             enable row level security;

-- Seat constraint function
create or replace function check_seat_limit()
returns trigger as $$
declare
  purchased int;
  active_count int;
begin
  if NEW.seat_status = 'active' then
    select purchased_seats into purchased
    from investor_organizations where id = NEW.organization_id;
    
    select count(*) into active_count
    from investor_users
    where organization_id = NEW.organization_id
      and seat_status = 'active'
      and id != NEW.id;
    
    if active_count >= purchased then
      raise exception 'Seat limit exceeded. Purchase more seats.';
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger enforce_seat_limit
before insert or update on investor_users
for each row execute function check_seat_limit();
`;
