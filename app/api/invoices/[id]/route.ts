import { NextRequest } from "next/server";
import { getInvoiceById } from "../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: "Missing invoice ID" }, { status: 400 });
    }
    
    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }
    
    return Response.json(invoice);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch invoice" }, { status: 500 });
  }
}
