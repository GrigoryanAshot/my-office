import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const shelvingDataPath = path.join(process.cwd(), "data", "shelving_database.json");

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!fs.existsSync(shelvingDataPath)) {
      return NextResponse.json({ error: "Shelving data not found" }, { status: 404 });
    }
    const data = fs.readFileSync(shelvingDataPath, "utf8");
    const parsed = JSON.parse(data);
    const shelving = (parsed.items || []).find(
      (item: any) => String(item.id) === String(id)
    );
    if (!shelving) {
      return NextResponse.json({ error: "Shelving item not found" }, { status: 404 });
    }
    return NextResponse.json(shelving);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shelving item" }, { status: 500 });
  }
} 