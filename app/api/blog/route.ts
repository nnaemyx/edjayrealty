import { NextRequest } from "next/server";
import { getBlogPosts, saveBlogPost, deleteBlogPost } from "../../lib/db";
import { BlogPost } from "../../lib/data";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return Response.json(posts);
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as BlogPost;
    if (!data.slug || !data.title) {
      return Response.json({ error: "Missing required fields (slug, title)" }, { status: 400 });
    }
    await saveBlogPost(data);
    return Response.json({ success: true, message: "Blog post created successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as BlogPost;
    if (!data.slug || !data.title) {
      return Response.json({ error: "Missing required fields (slug, title)" }, { status: 400 });
    }
    await saveBlogPost(data);
    return Response.json({ success: true, message: "Blog post updated successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return Response.json({ error: "Missing target slug parameter" }, { status: 400 });
    }
    await deleteBlogPost(slug);
    return Response.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to delete blog post" }, { status: 500 });
  }
}
