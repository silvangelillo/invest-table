import { z } from "zod";

// ─── Financial validation ─────────────────────────────────────────────────────
export const financialSchema = z.object({
  revenue_last_12m: z
    .number()
    .nonnegative("Revenue cannot be negative")
    .max(1_000_000_000, "Revenue seems unrealistically high")
    .nullable()
    .optional(),

  revenue_cagr_3y: z
    .number()
    .min(-100, "CAGR cannot be below -100%")
    .max(300, "CAGR cannot exceed 300%")
    .nullable()
    .optional(),

  employee_count: z
    .number()
    .int()
    .nonnegative("Employee count cannot be negative")
    .max(100_000)
    .optional(),
});

// ─── Startup registration schema ─────────────────────────────────────────────
export const startupRegistrationSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(10).max(120),
  short_description: z.string().max(500).optional(),
  category: z.enum(["Tech", "Food", "Service", "Sustainability"]),
  secondary_categories: z
    .array(z.enum([
      "SaaS", "DeepTech", "AI", "VR", "AR",
      "ClimateTech", "FinTech", "HealthTech", "Robotics",
      "Marketplace", "B2B", "B2C", "Hardware", "Biotech",
    ]))
    .max(5, "Maximum 5 secondary categories")
    .optional(),
  founded_year: z.number().int().min(2000).max(new Date().getFullYear()),
  team_size: z.number().int().min(1).max(10000),
  funding_stage: z.enum(["Pre-seed", "Seed", "Series A", "Series B+"]),
  pricing_tier: z.enum(["core", "plus", "ultra"]).default("core"),
  city: z.string().min(1),
  country: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  gdpr_compliant: z.literal(true, { errorMap: () => ({ message: "GDPR compliance is required" }) }),
  website_url: z.string().url().optional().or(z.literal("")),
  ...financialSchema.shape,
});

export type StartupRegistrationInput = z.infer<typeof startupRegistrationSchema>;

// ─── Seat management schema ───────────────────────────────────────────────────
export const seatActionSchema = z.object({
  investor_user_id: z.string().uuid(),
  action: z.enum(["activate", "deactivate"]),
  organization_id: z.string().uuid(),
});

// ─── Filter schema ────────────────────────────────────────────────────────────
export const searchFiltersSchema = z.object({
  categories: z.array(z.enum(["Tech", "Food", "Service", "Sustainability"])).optional(),
  secondary_categories: z.array(z.string()).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  funding_stage: z.string().optional(),
  min_team_size: z.number().int().nonnegative().optional(),
  max_team_size: z.number().int().nonnegative().optional(),
  pricing_tier: z.array(z.enum(["core", "plus", "ultra"])).optional(),
  min_revenue: z.number().nonnegative().optional(),
  max_revenue: z.number().nonnegative().optional(),
  min_cagr: z.number().min(-100).optional(),
  max_cagr: z.number().max(300).optional(),
  min_employees: z.number().int().nonnegative().optional(),
  max_employees: z.number().int().nonnegative().optional(),
});
