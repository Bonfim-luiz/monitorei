import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Keys used in the application
export const KEYS = {
  USERS: "monitorei:users",
  CONVOCATIONS: "monitorei:convocations",
} as const;
