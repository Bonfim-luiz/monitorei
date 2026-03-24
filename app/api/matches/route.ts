import { NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/redis";
import { User, Convocation, Match } from "@/lib/types";

// Normalize name for comparison (remove accents, extra spaces, etc.)
function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

// Check if two names match (case-insensitive, accent-insensitive)
function namesMatch(name1: string, name2: string): boolean {
  const normalized1 = normalizeName(name1);
  const normalized2 = normalizeName(name2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (for partial name matches)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  return false;
}

// GET /api/matches - Find matches between users and convocations
export async function GET() {
  try {
    console.log("[v0] GET /api/matches - Finding matches");
    
    // Get users from Redis
    let users = await redis.get<User[]>(KEYS.USERS);
    if (!users) {
      console.log("[v0] No users found in Redis");
      users = [];
    }
    console.log("[v0] Found", users.length, "users");
    
    // Get convocations from Redis
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      console.log("[v0] No convocations found in Redis");
      convocations = [];
    }
    console.log("[v0] Found", convocations.length, "convocations");
    
    // Find matches
    const matches: Match[] = [];
    
    for (const user of users) {
      for (const convocation of convocations) {
        if (namesMatch(user.name, convocation.name)) {
          console.log("[v0] Match found:", user.name, "<->", convocation.name);
          matches.push({
            user,
            convocation,
            matchedAt: new Date().toISOString(),
          });
        }
      }
    }
    
    console.log("[v0] Total matches found:", matches.length);
    
    return NextResponse.json({
      matches,
      usersCount: users.length,
      convocationsCount: convocations.length,
      matchesCount: matches.length,
    });
  } catch (error) {
    console.error("[v0] Error finding matches:", error);
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    );
  }
}
