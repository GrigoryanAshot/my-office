import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all wardrobes and types
export async function GET() {
  try {
    const wardrobes = await prisma.wardrobe.findMany({
      include: { type: true },
      orderBy: { createdAt: 'desc' },
    });
    const types = await prisma.wardrobeType.findMany({ orderBy: { name: 'asc' } });
    
    // Transform wardrobes to match frontend expectations
    const transformedWardrobes = wardrobes.map(wardrobe => ({
      ...wardrobe,
      imageUrl: wardrobe.image, // Map 'image' to 'imageUrl' for frontend compatibility
      type: wardrobe.type?.name || '' // Map type object to type name string
    }));
    
    return NextResponse.json({ items: transformedWardrobes, types });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wardrobes', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// POST: create a new wardrobe or type, or delete a type
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Handle type deletion
    if (data.action === 'deleteType' && data.typeName) {
      try {
        // Find the type by name
        const typeToDelete = await prisma.wardrobeType.findFirst({
          where: { name: data.typeName }
        });
        
        if (!typeToDelete) {
          return NextResponse.json({ error: 'Type not found' }, { status: 404 });
        }
        
        // Delete the type (this will fail if there are wardrobes using it)
        await prisma.wardrobeType.delete({
          where: { id: typeToDelete.id }
        });
        
        return NextResponse.json({ success: true });
      } catch (error) {
        // If deletion fails due to foreign key constraint, handle it gracefully
        if (error instanceof Error && error.message.includes('Foreign key constraint')) {
          return NextResponse.json({ 
            error: 'Cannot delete type because it is being used by one or more wardrobes. Please remove the type from all wardrobes first.' 
          }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to delete type', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
      }
    }
    
    const typeName = data.typeName || data.name;
    if (typeName && !data.typeId) {
      // Create a new wardrobe type
      const newType = await prisma.wardrobeType.create({
        data: { name: typeName },
      });
      return NextResponse.json({ success: true, type: newType });
    } else if (data.name) {
      // Create a new wardrobe
      const newWardrobe = await prisma.wardrobe.create({
        data: {
          name: data.name,
          description: data.description || '',
          image: data.image || '',
          price: data.price || null,
          oldPrice: data.oldPrice || null,
          images: data.images || [],
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          url: data.url || null,
          typeId: data.typeId || null,
        },
      });
      return NextResponse.json({ success: true, wardrobe: newWardrobe });
    } else {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// PUT: update an existing wardrobe
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Item ID is required for updates' }, { status: 400 });
    }

    // Find the type ID if we have a type name
    let typeId = null;
    if (data.type) {
      const type = await prisma.wardrobeType.findFirst({
        where: { name: data.type }
      });
      if (type) {
        typeId = type.id;
      }
    }

    // Update the existing wardrobe
    const updatedWardrobe = await prisma.wardrobe.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || '',
        image: data.image || '',
        price: data.price || null,
        oldPrice: data.oldPrice || null,
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        url: data.url || null,
        typeId: typeId,
      },
      include: { type: true }
    });

    // Transform the response to match frontend expectations
    const transformedWardrobe = {
      ...updatedWardrobe,
      imageUrl: updatedWardrobe.image,
      type: updatedWardrobe.type?.name || ''
    };

    return NextResponse.json({ success: true, wardrobe: transformedWardrobe });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    // Handle type deletion
    if (data.action === 'deleteType' && data.typeName) {
      try {
        // Find the type by name
        const typeToDelete = await prisma.wardrobeType.findFirst({
          where: { name: data.typeName }
        });
        if (!typeToDelete) {
          return NextResponse.json({ error: 'Type not found' }, { status: 404 });
        }
        // Delete the type (this will fail if there are wardrobes using it)
        await prisma.wardrobeType.delete({
          where: { id: typeToDelete.id }
        });
        return NextResponse.json({ success: true });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Foreign key constraint')) {
          return NextResponse.json({ 
            error: 'Cannot delete type because it is being used by one or more wardrobes. Please remove the type from all wardrobes first.' 
          }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to delete type', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
      }
    }
    // Handle item deletion
    if (data.action === 'deleteItem' && data.itemId) {
      try {
        await prisma.wardrobe.delete({
          where: { id: data.itemId }
        });
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process delete', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 