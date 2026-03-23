import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { timeEntries, projects, clients } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await db
      .select({
        id: timeEntries.id,
        description: timeEntries.description,
        startTime: timeEntries.startTime,
        endTime: timeEntries.endTime,
        duration: timeEntries.duration,
        billable: timeEntries.billable,
        projectId: timeEntries.projectId,
        projectName: projects.name,
        projectStatus: projects.status,
        clientId: projects.clientId,
        clientName: clients.name,
        createdAt: timeEntries.createdAt,
      })
      .from(timeEntries)
      .leftJoin(projects, eq(timeEntries.projectId, projects.id))
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(timeEntries.userId, session.user.id))
      .orderBy(desc(timeEntries.startTime));

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
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
    const { description, startTime, endTime, duration, billable, projectId } = body;

    if (!startTime) {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 });
    }

    const newEntry = {
      id: nanoid(),
      userId: session.user.id,
      projectId: projectId || null,
      description: description || null,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      duration: duration ? String(duration) : null,
      billable: billable !== false ? "true" : "false",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(timeEntries).values(newEntry);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
