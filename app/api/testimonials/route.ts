import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, saveTestimonial, deleteTestimonial } from "../../lib/db";
import { Testimonial } from "../../lib/data";

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();

    const id = payload.id;
    const name = payload.name;
    const content = payload.content || payload.text;

    if (!id || !name || !content) {
      return NextResponse.json(
        { error: "Missing required fields: id, name, and either content or text." },
        { status: 400 }
      );
    }

    const testimonial: Testimonial = {
      id,
      name,
      role: payload.role || "Investor",
      image: payload.image || "",
      content: content,
      rating: typeof payload.rating === "number" ? payload.rating : 5,
      investmentType: payload.investmentType || "",
    };

    await saveTestimonial(testimonial);
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("Failed to save testimonial:", error);
    return NextResponse.json(
      { error: "Failed to save testimonial." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing testimonial ID." },
        { status: 400 }
      );
    }

    await deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial." },
      { status: 500 }
    );
  }
}
