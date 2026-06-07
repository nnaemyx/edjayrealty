import { NextRequest } from "next/server";
import { deleteNewsletterSubscriber } from "../../../lib/db";
import { cookies } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    if (!decodedEmail) {
      return Response.json({ error: "Missing email parameter" }, { status: 400 });
    }

    await deleteNewsletterSubscriber(decodedEmail);
    return Response.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error: any) {
    console.error("Newsletter deletion error:", error);
    return Response.json(
      { error: error.message || "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
