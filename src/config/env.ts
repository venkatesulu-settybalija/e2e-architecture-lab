import { z } from "zod";

const envSchema = z.object({
  BASE_URL: z.string().url().default("http://127.0.0.1:3000"),
  DEMO_USER: z.string().default("demo"),
  DEMO_PASS: z.string().default("demo123"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(overrides?: Record<string, string | undefined>): Env {
  return envSchema.parse({
    BASE_URL: process.env.BASE_URL ?? overrides?.BASE_URL,
    DEMO_USER: process.env.DEMO_USER ?? overrides?.DEMO_USER,
    DEMO_PASS: process.env.DEMO_PASS ?? overrides?.DEMO_PASS,
  });
}
