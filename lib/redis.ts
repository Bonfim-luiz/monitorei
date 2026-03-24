import { Redis } from "@upstash/redis";

// Initialize Redis client with environment variables
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Key constants for data storage
export const KEYS = {
  USERS: "monitorei:users",
  CONVOCATIONS: "monitorei:convocations",
  MATCHES: "monitorei:matches",
} as const;

// Type definitions
export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface Convocation {
  id: string;
  name: string;
  classification?: string;
  source?: string;
  extractedAt: string;
}

export interface Match {
  id: string;
  userId: string;
  userName: string;
  convocationId: string;
  convocationName: string;
  classification?: string;
  matchedAt: string;
}
