import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { projects } from "@/drizzle/schema";
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
    
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
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
    const { name, description, status, budget, deadline, clientId } = body;
    
    await db
      .update(projects)
      .set({
        name,
        description,
        status,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        clientId: clientId || null,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

    const updated = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating project:", error);
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
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
