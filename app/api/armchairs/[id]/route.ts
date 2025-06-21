import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const armchairsDataPath = path.join(process.cwd(), "data", "armchairs_database.json");

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!fs.existsSync(armchairsDataPath)) {
      return NextResponse.json({ error: "Armchairs data not found" }, { status: 404 });
    }
    const data = fs.readFileSync(armchairsDataPath, "utf8");
    const parsed = JSON.parse(data);
    const armchair = (parsed.items || []).find((item: any) => String(item.id) === String(id));
    if (!armchair) {
      return NextResponse.json({ error: "Armchair not found" }, { status: 404 });
    }
    return NextResponse.json(armchair);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch armchair" }, { status: 500 });
  }
} 