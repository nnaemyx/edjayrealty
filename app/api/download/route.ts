import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Fix Cloudinary URLs: PDFs must use /raw/upload/ not /image/upload/
    let fetchUrl = url;
    if (fetchUrl.includes("cloudinary.com") && fetchUrl.toLowerCase().endsWith(".pdf")) {
      fetchUrl = fetchUrl.replace("/image/upload/", "/raw/upload/");
    }

    // Fetch the file from the remote URL server-side
    const response = await fetch(fetchUrl);

    // If the raw URL also fails, try without any path transformation
    if (!response.ok && fetchUrl !== url) {
      const fallbackResponse = await fetch(url);
      if (fallbackResponse.ok) {
        const fileBuffer = await fallbackResponse.arrayBuffer();
        return buildPdfResponse(fileBuffer, url);
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file (status: ${response.status})` },
        { status: 502 }
      );
    }

    const fileBuffer = await response.arrayBuffer();
    return buildPdfResponse(fileBuffer, url);
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}

function buildPdfResponse(fileBuffer: ArrayBuffer, url: string): NextResponse {
  // Extract a filename from the URL or use a default
  const urlPath = new URL(url).pathname;
  const segments = urlPath.split("/");
  let filename = segments[segments.length - 1] || "brochure.pdf";
  // Ensure filename has .pdf extension
  if (!filename.toLowerCase().endsWith(".pdf")) {
    filename += ".pdf";
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(fileBuffer.byteLength),
    },
  });
}
