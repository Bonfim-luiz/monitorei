import { NextRequest, NextResponse } from "next/server";
import { redis, KEYS, Convocation } from "@/lib/redis";

// GET - Retrieve all convocations
export async function GET() {
  try {
    console.log("[v0] GET /api/convocations - Fetching convocations from Redis");
    
    // Get convocations from Redis, initialize as empty array if null
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    
    if (!convocations) {
      console.log("[v0] No convocations found in Redis, initializing empty array");
      convocations = [];
      await redis.set(KEYS.CONVOCATIONS, convocations);
    }
    
    console.log("[v0] Returning convocations:", convocations.length, "total");
    return NextResponse.json(convocations);
  } catch (error) {
    console.error("[v0] Error fetching convocations:", error);
    return NextResponse.json(
      { error: "Failed to fetch convocations" },
      { status: 500 }
    );
  }
}

// POST - Create a new convocation manually
export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/convocations - Creating new convocation");
    
    const body = await request.json();
    const { name, classification, source } = body;
    
    if (!name || typeof name !== "string" || name.trim() === "") {
      console.log("[v0] Invalid convocation data - name is required");
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    
    // Get existing convocations
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      console.log("[v0] No existing convocations, initializing array");
      convocations = [];
    }
    
    // Create new convocation
    const newConvocation: Convocation = {
      id: crypto.randomUUID(),
      name: name.trim().toUpperCase(),
      classification: classification?.trim() || undefined,
      source: source?.trim() || "manual",
      extractedAt: new Date().toISOString(),
    };
    
    // Add to array
    convocations.push(newConvocation);
    
    // Save to Redis
    await redis.set(KEYS.CONVOCATIONS, convocations);
    console.log("[v0] Convocation saved successfully:", newConvocation.id, newConvocation.name);
    console.log("[v0] Total convocations now:", convocations.length);
    
    return NextResponse.json(newConvocation, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating convocation:", error);
    return NextResponse.json(
      { error: "Failed to create convocation" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a convocation by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    console.log("[v0] DELETE /api/convocations - Deleting convocation:", id);
    
    if (!id) {
      return NextResponse.json(
        { error: "Convocation ID is required" },
        { status: 400 }
      );
    }
    
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      return NextResponse.json(
        { error: "Convocation not found" },
        { status: 404 }
      );
    }
    
    const initialLength = convocations.length;
    convocations = convocations.filter((c) => c.id !== id);
    
    if (convocations.length === initialLength) {
      return NextResponse.json(
        { error: "Convocation not found" },
        { status: 404 }
      );
    }
    
    await redis.set(KEYS.CONVOCATIONS, convocations);
    console.log("[v0] Convocation deleted successfully, remaining:", convocations.length);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting convocation:", error);
    return NextResponse.json(
      { error: "Failed to delete convocation" },
      { status: 500 }
    );
  }
}

// PUT - Clear all convocations
export async function PUT() {
  try {
    console.log("[v0] PUT /api/convocations - Clearing all convocations");
    await redis.set(KEYS.CONVOCATIONS, []);
    console.log("[v0] All convocations cleared");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error clearing convocations:", error);
    return NextResponse.json(
      { error: "Failed to clear convocations" },
      { status: 500 }
    );
  }
}
