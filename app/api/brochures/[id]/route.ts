import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDatabaseName } from "../../../lib/mongodb";

// GET: Serve a PDF from MongoDB by its ID — triggers instant download
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!clientPromise) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    const doc = await db.collection("brochures").findOne({ _id: id } as any);

    if (!doc) {
      return NextResponse.json({ error: "Brochure not found" }, { status: 404 });
    }

    // Convert base64 back to binary
    const buffer = Buffer.from(doc.data, "base64");

    const filename = doc.filename || "brochure.pdf";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Brochure download error:", error);
    return NextResponse.json(
      { error: "Failed to download brochure." },
      { status: 500 }
    );
  }
}
