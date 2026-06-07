import { NextRequest } from "next/server";
import { getNewsletterSubscribers, saveNewsletterSubscriber } from "../../lib/db";
import { cookies } from "next/headers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, name } = data;

    if (!email) {
      return Response.json({ error: "Email address is required" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return Response.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    await saveNewsletterSubscriber({
      email: email.toLowerCase().trim(),
      name: name?.trim() || undefined,
      subscribedAt: new Date().toISOString(),
      status: "active",
    });

    return Response.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return Response.json(
      { error: error.message || "Failed to process subscription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await getNewsletterSubscribers();
    return Response.json(subscribers);
  } catch (error: any) {
    console.error("Newsletter fetch error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
