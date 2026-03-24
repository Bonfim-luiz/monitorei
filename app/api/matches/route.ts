import { NextResponse } from "next/server";
import { redis, KEYS, User, Convocation, Match } from "@/lib/redis";

// Helper function to normalize names for comparison
function normalizeName(name: string): string {
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^A-Z\s]/g, "") // Remove non-letters
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

// Check if two names match (exact or partial)
function namesMatch(userName: string, convocationName: string): boolean {
  const normalizedUser = normalizeName(userName);
  const normalizedConvocation = normalizeName(convocationName);
  
  // Exact match
  if (normalizedUser === normalizedConvocation) {
    return true;
  }
  
  // Check if user name is contained in convocation name or vice versa
  if (normalizedConvocation.includes(normalizedUser) || normalizedUser.includes(normalizedConvocation)) {
    return true;
  }
  
  // Check word-by-word similarity (at least first and last name match)
  const userWords = normalizedUser.split(" ").filter(w => w.length > 2);
  const convWords = normalizedConvocation.split(" ").filter(w => w.length > 2);
  
  if (userWords.length >= 2 && convWords.length >= 2) {
    const firstNameMatch = userWords[0] === convWords[0];
    const lastNameMatch = userWords[userWords.length - 1] === convWords[convWords.length - 1];
    
    if (firstNameMatch && lastNameMatch) {
      return true;
    }
  }
  
  return false;
}

// GET - Find matches between users and convocations
export async function GET() {
  try {
    console.log("[v0] GET /api/matches - Finding matches");
    
    // Load users from Redis
    let users = await redis.get<User[]>(KEYS.USERS);
    if (!users) {
      console.log("[v0] No users found, initializing empty array");
      users = [];
    }
    console.log("[v0] Loaded users:", users.length);
    
    // Load convocations from Redis
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      console.log("[v0] No convocations found, initializing empty array");
      convocations = [];
    }
    console.log("[v0] Loaded convocations:", convocations.length);
    
    // Find matches
    const matches: Match[] = [];
    
    for (const user of users) {
      for (const convocation of convocations) {
        if (namesMatch(user.name, convocation.name)) {
          console.log("[v0] MATCH FOUND:", user.name, "->", convocation.name);
          
          matches.push({
            id: crypto.randomUUID(),
            userId: user.id,
            userName: user.name,
            convocationId: convocation.id,
            convocationName: convocation.name,
            classification: convocation.classification,
            matchedAt: new Date().toISOString(),
          });
        }
      }
    }
    
    console.log("[v0] Total matches found:", matches.length);
    
    // Save matches to Redis for reference
    await redis.set(KEYS.MATCHES, matches);
    
    return NextResponse.json({
      matches,
      stats: {
        totalUsers: users.length,
        totalConvocations: convocations.length,
        totalMatches: matches.length,
      },
    });
    
  } catch (error) {
    console.error("[v0] Error finding matches:", error);
    return NextResponse.json(
      { error: "Failed to find matches" },
      { status: 500 }
    );
  }
}

// POST - Manually trigger match calculation and get results
export async function POST() {
  try {
    console.log("[v0] POST /api/matches - Recalculating matches");
    
    // This performs the same logic as GET but forces a recalculation
    let users = await redis.get<User[]>(KEYS.USERS);
    if (!users) users = [];
    
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) convocations = [];
    
    const matches: Match[] = [];
    
    for (const user of users) {
      for (const convocation of convocations) {
        if (namesMatch(user.name, convocation.name)) {
          matches.push({
            id: crypto.randomUUID(),
            userId: user.id,
            userName: user.name,
            convocationId: convocation.id,
            convocationName: convocation.name,
            classification: convocation.classification,
            matchedAt: new Date().toISOString(),
          });
        }
      }
    }
    
    await redis.set(KEYS.MATCHES, matches);
    console.log("[v0] Matches recalculated and saved:", matches.length);
    
    return NextResponse.json({
      success: true,
      matches,
      stats: {
        totalUsers: users.length,
        totalConvocations: convocations.length,
        totalMatches: matches.length,
      },
    });
    
  } catch (error) {
    console.error("[v0] Error recalculating matches:", error);
    return NextResponse.json(
      { error: "Failed to recalculate matches" },
      { status: 500 }
    );
  }
}
