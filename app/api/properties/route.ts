import { NextRequest } from "next/server";
import { getProperties, saveProperty, deleteProperty, Plot } from "../../lib/db";

export async function GET() {
  try {
    const properties = await getProperties();
    return Response.json(properties);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as Plot;
    if (!data.id || !data.name) {
      return Response.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    await saveProperty(data);
    return Response.json({ success: true, message: "Property registered successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to register property" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as Plot;
    if (!data.id || !data.name) {
      return Response.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    await saveProperty(data);
    return Response.json({ success: true, message: "Property updated successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing target property ID parameter" }, { status: 400 });
    }
    await deleteProperty(id);
    return Response.json({ success: true, message: "Property record deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to delete property record" }, { status: 500 });
  }
}
