import { NextRequest } from "next/server";
import {
  getGalleryImages,
  saveGalleryImage,
  deleteGalleryImage,
} from "../../lib/db";
import { GalleryImage } from "../../lib/data";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return Response.json(images);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch gallery";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as GalleryImage;
    if (!data.id || !data.src) {
      return Response.json({ error: "Missing required fields (id, src)" }, { status: 400 });
    }
    const image: GalleryImage = {
      id: data.id,
      src: data.src,
      alt: data.alt || "Gallery image",
      category: data.category || "Estates",
      isVideo: !!data.isVideo,
      videoUrl: data.videoUrl || "",
    };
    await saveGalleryImage(image);
    return Response.json({ success: true, image });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save gallery image";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "Missing image ID" }, { status: 400 });
    }
    await deleteGalleryImage(id);
    return Response.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete gallery image";
    return Response.json({ error: message }, { status: 500 });
  }
}
