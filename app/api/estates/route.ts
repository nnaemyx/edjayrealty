import { NextRequest } from "next/server";
import { getEstates, saveEstate, deleteEstate } from "../../lib/db";
import { Estate } from "../../lib/data";

export async function GET() {
  try {
    const estates = await getEstates();
    return Response.json(estates);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch estates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Estate;
    if (!data.id || !data.name) {
      return Response.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    await saveEstate(data);
    return Response.json({ success: true, message: "Estate registered successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to register estate" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as Estate;
    if (!data.id || !data.name) {
      return Response.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    await saveEstate(data);
    return Response.json({ success: true, message: "Estate updated successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to update estate" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing target estate ID parameter" }, { status: 400 });
    }
    await deleteEstate(id);
    return Response.json({ success: true, message: "Estate deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to delete estate" }, { status: 500 });
  }
}
