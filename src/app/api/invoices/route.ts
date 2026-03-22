import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc } from "drizzle-orm";
import { invoices, projects, clients } from "@/drizzle/schema";
import { nanoid } from "nanoid";

export const runtime = 'edge';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = drizzle({} as any);
    
    const allInvoices = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        amount: invoices.amount,
        dueDate: invoices.dueDate,
        paidDate: invoices.paidDate,
        items: invoices.items,
        projectId: invoices.projectId,
        projectName: projects.name,
        clientId: projects.clientId,
        clientName: clients.name,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));

    return NextResponse.json(allInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
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
    const { invoiceNumber, status, amount, dueDate, projectId, items } = body;

    if (!invoiceNumber || !amount || !dueDate) {
      return NextResponse.json({ error: "Invoice number, amount and due date are required" }, { status: 400 });
    }

    const db = drizzle({} as any);
    
    const newInvoice = {
      id: nanoid(),
      userId,
      projectId: projectId || null,
      invoiceNumber,
      status: status || "draft",
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      paidDate: status === "paid" ? new Date() : null,
      items: items ? JSON.stringify(items) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(invoices).values(newInvoice);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
