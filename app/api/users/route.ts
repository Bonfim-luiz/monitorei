import { NextRequest, NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/redis";
import { User } from "@/lib/types";

// GET /api/users - List all users
export async function GET() {
  try {
    console.log("[v0] GET /api/users - Fetching users from Redis");
    
    let users = await redis.get<User[]>(KEYS.USERS);
    
    // Initialize with empty array if null
    if (!users) {
      console.log("[v0] No users found in Redis, returning empty array");
      users = [];
    }
    
    console.log("[v0] Returning", users.length, "users");
    return NextResponse.json(users);
  } catch (error) {
    console.error("[v0] Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[v0] POST /api/users - Creating user:", body);
    
    const { name, email } = body;
    
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Get existing users
    let users = await redis.get<User[]>(KEYS.USERS);
    if (!users) {
      console.log("[v0] No existing users, initializing empty array");
      users = [];
    }
    
    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim().toUpperCase(),
      email: email || undefined,
      createdAt: new Date().toISOString(),
    };
    
    // Add to array
    users.push(newUser);
    
    // Save to Redis
    await redis.set(KEYS.USERS, users);
    console.log("[v0] User saved successfully. Total users:", users.length);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete a user by ID (via query param)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("[v0] DELETE /api/users - Deleting user:", id);
    
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    let users = await redis.get<User[]>(KEYS.USERS);
    if (!users) {
      users = [];
    }
    
    const initialLength = users.length;
    users = users.filter((user) => user.id !== id);
    
    if (users.length === initialLength) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    await redis.set(KEYS.USERS, users);
    console.log("[v0] User deleted. Remaining users:", users.length);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
