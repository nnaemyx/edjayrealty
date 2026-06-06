import { getStats, saveStats, defaultStats } from "../../lib/db";

export async function GET() {
  try {
    const stats = await getStats();
    return Response.json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const stats = {
      happyClients: Number(data.happyClients) || 0,
      propertiesSold: Number(data.propertiesSold) || 0,
      estatesManaged: Number(data.estatesManaged) || 0,
      investmentVolume: Number(data.investmentVolume) || 0,
      yearFounded: Number(data.yearFounded) || defaultStats.yearFounded,
      ongoingProjects: Number(data.ongoingProjects) || defaultStats.ongoingProjects,
    };
    await saveStats(stats);
    return Response.json({ success: true, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save stats";
    return Response.json({ error: message }, { status: 500 });
  }
}
