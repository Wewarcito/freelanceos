import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { clients } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const client = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)))
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client[0]);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, company, address, notes } = body;
    
    await db
      .update(clients)
      .set({
        name,
        email,
        phone,
        company,
        address,
        notes,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    const updated = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
