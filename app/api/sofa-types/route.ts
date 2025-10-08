import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.sofaType.findMany();
    return NextResponse.json(types);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sofa types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const type = await prisma.sofaType.create({
      data: {
        name,
      },
    });

    return NextResponse.json(type);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create sofa type" },
      { status: 500 }
    );
  }
} 