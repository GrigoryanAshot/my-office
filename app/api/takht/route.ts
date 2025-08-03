import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "takht_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to read data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('POST request body:', data);
    
    // Read current data from JSON file
    const filePath = path.join(process.cwd(), "data", "takht_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const currentData = JSON.parse(fileContents);
    
    // Update data
    let updatedTypes = currentData.types;
    if (Array.isArray(data.types)) {
      updatedTypes = data.types;
    }
    let updatedItems = currentData.items;
    if (Array.isArray(data.items)) {
      updatedItems = data.items;
    }
    
    const finalData = { items: updatedItems, types: updatedTypes };
    
    // Write back to JSON file
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Data updated successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { typeName, typeIndex, itemId } = await request.json();
    console.log('DELETE request body:', { typeName, typeIndex, itemId });
    
    // Read current data from JSON file
    const filePath = path.join(process.cwd(), "data", "takht_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const currentData = JSON.parse(fileContents);
    
    let updatedTypes = [...(currentData.types || [])];
    let updatedItems = [...(currentData.items || [])];
    
    // Delete by typeName
    if (typeName) {
      updatedTypes = updatedTypes.filter((type: string) => type !== typeName);
      updatedItems = updatedItems.map((item: any) => item.type === typeName ? { ...item, type: '' } : item);
    }
    // Delete by type index
    else if (typeof typeIndex === 'number' && typeIndex >= 0 && typeIndex < updatedTypes.length) {
      const removedType = updatedTypes[typeIndex];
      updatedTypes.splice(typeIndex, 1);
      updatedItems = updatedItems.map((item: any) => item.type === removedType ? { ...item, type: '' } : item);
    }
    // Delete by item ID
    else if (itemId) {
      updatedItems = updatedItems.filter((item: any) => item.id !== itemId);
    }
    
    const finalData = { items: updatedItems, types: updatedTypes };
    
    // Write back to JSON file
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
    
    return NextResponse.json({
      success: true,
      deletedType: typeName || (typeof typeIndex === 'number' ? currentData.types[typeIndex] : null),
      deletedItemId: itemId,
      remainingTypes: updatedTypes,
      remainingItems: updatedItems
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 