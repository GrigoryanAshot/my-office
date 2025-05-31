import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const takhtDataPath = path.join(process.cwd(), "data", "takht_database.json");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(takhtDataPath)) {
      return NextResponse.json({ error: "Takht data not found" }, { status: 404 });
    }
    const data = fs.readFileSync(takhtDataPath, "utf8");
    const parsed = JSON.parse(data);
    const takht = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!takht) {
      return NextResponse.json({ error: "Takht not found" }, { status: 404 });
    }
    return NextResponse.json(takht);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch takht" }, { status: 500 });
  }
} 