import { getCeoProfile, saveCeoProfile, CeoProfile } from "../../lib/db";

export async function GET() {
  try {
    const profile = await getCeoProfile();
    return Response.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch CEO profile";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const profile: CeoProfile = {
      sectionLabel: data.sectionLabel || "Meet The Founder",
      name: data.name || "",
      role: data.role || "Founder & CEO",
      tagline: data.tagline || "",
      image: data.image || "",
      bioParagraph1: data.bioParagraph1 || "",
      bioParagraph2: data.bioParagraph2 || "",
      achievements: Array.isArray(data.achievements)
        ? data.achievements.map((a: { label?: string; value?: string }) => ({
            label: a.label || "",
            value: a.value || "",
          }))
        : [],
    };
    if (!profile.name) {
      return Response.json({ error: "CEO name is required" }, { status: 400 });
    }
    await saveCeoProfile(profile);
    return Response.json({ success: true, profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save CEO profile";
    return Response.json({ error: message }, { status: 500 });
  }
}
