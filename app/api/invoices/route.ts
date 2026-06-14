import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getInvoices, saveInvoice, deleteInvoice } from "../../lib/db";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return !!token;
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const invoices = await getInvoices();
    return Response.json(invoices);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    if (!data.id || !data.clientName || !data.estateName || !data.quantity || !data.unitPrice) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    await saveInvoice(data);
    return Response.json({ success: true, message: "Invoice saved successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to save invoice" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing invoice ID parameter" }, { status: 400 });
    }
    await deleteInvoice(id);
    return Response.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to delete invoice" }, { status: 500 });
  }
}
