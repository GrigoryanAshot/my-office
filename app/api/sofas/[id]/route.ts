import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const sofasDataPath = path.join(process.cwd(), "data", "sofas_database.json");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(sofasDataPath)) {
      return NextResponse.json({ error: "Sofas data not found" }, { status: 404 });
    }
    const data = fs.readFileSync(sofasDataPath, "utf8");
    const parsed = JSON.parse(data);
    const sofa = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!sofa) {
      return NextResponse.json({ error: "Sofa not found" }, { status: 404 });
    }
    return NextResponse.json(sofa);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sofa" }, { status: 500 });
  }
} 