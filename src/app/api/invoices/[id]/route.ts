import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { invoices } from "@/drizzle/schema";
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
    
    const invoice = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
      .limit(1);

    if (invoice.length === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice[0]);
  } catch (error) {
    console.error("Error fetching invoice:", error);
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
    const { invoiceNumber, status, amount, dueDate, paidDate, projectId, items } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber;
    if (status !== undefined) updateData.status = status;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
    if (projectId !== undefined) updateData.projectId = projectId || null;
    if (items !== undefined) updateData.items = items ? JSON.stringify(items) : null;
    if (status === "paid" && paidDate) {
      updateData.paidDate = new Date(paidDate);
    } else if (status === "paid" && !paidDate) {
      updateData.paidDate = new Date();
    } else if (status !== "paid") {
      updateData.paidDate = null;
    }

    await db
      .update(invoices)
      .set(updateData)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)));

    const updated = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating invoice:", error);
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
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
