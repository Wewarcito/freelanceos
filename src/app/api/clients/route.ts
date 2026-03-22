import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { clients } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";

export const runtime = 'edge';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allClients = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId));

    return NextResponse.json(allClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, company, address, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newClient = {
      id: nanoid(),
      userId,
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      address: address || null,
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(clients).values(newClient);

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
