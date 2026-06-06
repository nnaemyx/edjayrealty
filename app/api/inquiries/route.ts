import { NextRequest } from "next/server";
import { getInquiries, saveInquiry, deleteInquiry, Inquiry } from "../../lib/db";

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return Response.json(inquiries);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.phone) {
      return Response.json({ error: "Missing required fields (name, email, phone)" }, { status: 400 });
    }
    const newInquiry: Inquiry = {
      id: data.id || `ld-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || "",
      estate: data.estate || "General Inquiry",
      date: data.date || new Date().toISOString().split("T")[0],
      status: data.status || "New",
    };
    await saveInquiry(newInquiry);
    return Response.json({ success: true, message: "Inquiry submitted successfully", inquiry: newInquiry });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as Inquiry;
    if (!data.id) {
      return Response.json({ error: "Missing inquiry ID" }, { status: 400 });
    }
    await saveInquiry(data);
    return Response.json({ success: true, message: "Inquiry status updated successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing target inquiry ID parameter" }, { status: 400 });
    }
    await deleteInquiry(id);
    return Response.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to delete inquiry" }, { status: 500 });
  }
}
