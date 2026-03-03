/**
 * InvestTable — Test user seeder
 *
 * Prerequisites:
 *   1. Supabase SQL setup has been run (tables + triggers exist)
 *   2. Email confirmation is DISABLED in Supabase Auth → Settings
 *   3. SUPABASE_SERVICE_ROLE_KEY is set in .env.local
 *
 * Run with:
 *   npx tsx scripts/seed-users.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const svcKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !svcKey) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Admin client — bypasses RLS and email confirmation
const supabase = createClient(url, svcKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
  {
    email:    "investor@test.com",
    password: "Test1234!",
    role:     "investor",
    name:     "Test Investor",
  },
  {
    email:    "investor2@test.com",
    password: "Test1234!",
    role:     "investor",
    name:     "Second Investor",
  },
  {
    email:    "startup@test.com",
    password: "Test1234!",
    role:     "startup",
    name:     "Test Startup",
  },
];

async function seed() {
  console.log("🌱  Seeding test users...\n");

  for (const u of TEST_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email:             u.email,
      password:          u.password,
      email_confirm:     true,          // skip confirmation email
      user_metadata:     { role: u.role, full_name: u.name },
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        console.log(`⚠️   ${u.email} already exists — skipping`);
      } else {
        console.error(`❌  ${u.email}: ${error.message}`);
      }
      continue;
    }

    console.log(`✅  Created ${u.role.padEnd(8)} → ${u.email}  (id: ${data.user.id})`);
  }

  console.log("\n🔑  Credentials for all accounts:  password = Test1234!");
  console.log("\n📋  Summary:");
  console.log("   investor@test.com   → /dashboard");
  console.log("   investor2@test.com  → /dashboard");
  console.log("   startup@test.com    → /onboarding");
}

seed();
