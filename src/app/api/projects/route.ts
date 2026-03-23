import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { projects, clients } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        budget: projects.budget,
        deadline: projects.deadline,
        clientId: projects.clientId,
        userId: projects.userId,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        clientName: clients.name,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.userId, session.user.id));

    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, status, budget, deadline, clientId } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newProject = {
      id: nanoid(),
      userId: session.user.id,
      clientId: clientId || null,
      name,
      description: description || null,
      status: status || "potential",
      budget: budget ? parseFloat(budget) : null,
      deadline: deadline ? new Date(deadline) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(projects).values(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
