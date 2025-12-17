import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wardrobe = await prisma.wardrobe.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!wardrobe) {
      return NextResponse.json({ error: 'Wardrobe not found' }, { status: 404 });
    }
    
    // Transform the response to match frontend expectations
    const transformedWardrobe = {
      ...wardrobe,
      imageUrl: wardrobe.image, // Map 'image' to 'imageUrl'
      id: parseInt(wardrobe.id) // Convert string ID to number if needed
    };
    
    return NextResponse.json(transformedWardrobe);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wardrobe', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.wardrobe.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete wardrobe', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 