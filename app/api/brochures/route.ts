import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getDatabaseName } from "../../lib/mongodb";

// POST: Upload a PDF and store it in MongoDB as base64
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Generate a unique ID for this PDF
    const pdfId = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Store in MongoDB
    if (!clientPromise) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db(getDatabaseName());

    await db.collection("brochures").insertOne({
      _id: pdfId as any,
      filename: file.name,
      mimeType: "application/pdf",
      size: file.size,
      data: base64,
      uploadedAt: new Date().toISOString(),
    });

    // Return a local URL that serves the PDF from our own API
    const downloadUrl = `/api/brochures/${pdfId}`;

    return NextResponse.json({
      url: downloadUrl,
      pdfId,
      filename: file.name,
    });
  } catch (error) {
    console.error("Brochure upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload brochure." },
      { status: 500 }
    );
  }
}
