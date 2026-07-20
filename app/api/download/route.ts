import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Fetch the file from the remote URL server-side
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from remote server" },
        { status: 502 }
      );
    }

    // Extract a filename from the URL or use a default
    const urlPath = new URL(url).pathname;
    const segments = urlPath.split("/");
    let filename = segments[segments.length - 1] || "brochure.pdf";
    // Ensure filename has .pdf extension
    if (!filename.toLowerCase().endsWith(".pdf")) {
      filename += ".pdf";
    }

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(fileBuffer.byteLength),
      },
    });
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
