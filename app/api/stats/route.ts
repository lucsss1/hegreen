import { NextRequest, NextResponse } from "next/server";

const AF = "https://v3.football.api-sports.io";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  let path: string | null = null;

  if (action === "search") {
    const q = searchParams.get("q");
    if (!q) return NextResponse.json({ error: "missing q" }, { status: 400 });
    path = `/teams?search=${encodeURIComponent(q)}`;
  } else if (action === "fixtures") {
    const teamId = searchParams.get("teamId");
    if (!teamId) return NextResponse.json({ error: "missing teamId" }, { status: 400 });
    path = `/fixtures?team=${encodeURIComponent(teamId)}&last=10&status=FT`;
  } else if (action === "h2h") {
    const t1 = searchParams.get("t1");
    const t2 = searchParams.get("t2");
    if (!t1 || !t2) return NextResponse.json({ error: "missing t1/t2" }, { status: 400 });
    path = `/fixtures/headtohead?h2h=${encodeURIComponent(t1)}-${encodeURIComponent(t2)}&last=8&status=FT`;
  } else {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  try {
    const r = await fetch(AF + path, {
      headers: { "x-apisports-key": process.env.AF_API_KEY! },
    });
    if (!r.ok) {
      return NextResponse.json({ error: "API-Football error" }, { status: r.status });
    }
    const data = await r.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "upstream fetch failed" }, { status: 502 });
  }
}
