import { NextRequest, NextResponse } from "next/server";
import { redis, KEYS } from "@/lib/redis";
import { Convocation } from "@/lib/types";

// GET /api/convocations - List all convocations
export async function GET() {
  try {
    console.log("[v0] GET /api/convocations - Fetching convocations from Redis");
    
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    
    // Initialize with empty array if null
    if (!convocations) {
      console.log("[v0] No convocations found in Redis, returning empty array");
      convocations = [];
    }
    
    console.log("[v0] Returning", convocations.length, "convocations");
    return NextResponse.json(convocations);
  } catch (error) {
    console.error("[v0] Error fetching convocations:", error);
    return NextResponse.json(
      { error: "Failed to fetch convocations" },
      { status: 500 }
    );
  }
}

// POST /api/convocations - Add convocations manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[v0] POST /api/convocations - Adding convocations:", body);
    
    const { convocations: newConvocations } = body;
    
    if (!Array.isArray(newConvocations)) {
      return NextResponse.json(
        { error: "convocations must be an array" },
        { status: 400 }
      );
    }
    
    // Get existing convocations
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      console.log("[v0] No existing convocations, initializing empty array");
      convocations = [];
    }
    
    // Add new convocations with IDs
    const addedConvocations: Convocation[] = newConvocations.map((conv: { classification?: string; name?: string; source?: string }) => ({
      id: crypto.randomUUID(),
      classification: conv.classification || "",
      name: (conv.name || "").toUpperCase().trim(),
      source: conv.source || "manual",
      extractedAt: new Date().toISOString(),
    }));
    
    convocations = [...convocations, ...addedConvocations];
    
    // Save to Redis
    await redis.set(KEYS.CONVOCATIONS, convocations);
    console.log("[v0] Convocations saved. Total:", convocations.length);
    
    return NextResponse.json(addedConvocations, { status: 201 });
  } catch (error) {
    console.error("[v0] Error adding convocations:", error);
    return NextResponse.json(
      { error: "Failed to add convocations" },
      { status: 500 }
    );
  }
}

// DELETE /api/convocations - Clear all convocations or delete by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";
    
    console.log("[v0] DELETE /api/convocations - id:", id, "clearAll:", clearAll);
    
    if (clearAll) {
      await redis.set(KEYS.CONVOCATIONS, []);
      console.log("[v0] All convocations cleared");
      return NextResponse.json({ success: true, message: "All convocations cleared" });
    }
    
    if (!id) {
      return NextResponse.json(
        { error: "Convocation ID is required (or use ?all=true to clear all)" },
        { status: 400 }
      );
    }
    
    let convocations = await redis.get<Convocation[]>(KEYS.CONVOCATIONS);
    if (!convocations) {
      convocations = [];
    }
    
    const initialLength = convocations.length;
    convocations = convocations.filter((conv) => conv.id !== id);
    
    if (convocations.length === initialLength) {
      return NextResponse.json(
        { error: "Convocation not found" },
        { status: 404 }
      );
    }
    
    await redis.set(KEYS.CONVOCATIONS, convocations);
    console.log("[v0] Convocation deleted. Remaining:", convocations.length);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Error deleting convocations:", error);
    return NextResponse.json(
      { error: "Failed to delete convocations" },
      { status: 500 }
    );
  }
}
