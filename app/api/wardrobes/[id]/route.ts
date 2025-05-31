import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const wardrobesDataPath = path.join(process.cwd(), "data", "wardrobes_database.json");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(wardrobesDataPath)) {
      return NextResponse.json({ error: "Wardrobes data not found" }, { status: 404 });
    }
    const data = fs.readFileSync(wardrobesDataPath, "utf8");
    const parsed = JSON.parse(data);
    const wardrobe = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!wardrobe) {
      return NextResponse.json({ error: "Wardrobe not found" }, { status: 404 });
    }
    return NextResponse.json(wardrobe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wardrobe" }, { status: 500 });
  }
} 