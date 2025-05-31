import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use a single database file for sofas
const sofasDataPath = path.join(process.cwd(), 'data', 'sofas_database.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Initialize sofas_database.json if it doesn't exist
if (!fs.existsSync(sofasDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(sofasDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating sofas_database.json:', error);
  }
}

export async function GET() {
  try {
    console.log('GET /api/sofas - Reading data from:', sofasDataPath);
    
    // Ensure file exists
    if (!fs.existsSync(sofasDataPath)) {
      console.log('File does not exist, creating initial data');
      const initialData = { items: [], types: [] };
      fs.writeFileSync(sofasDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    }

    // Read and parse the file
    const data = fs.readFileSync(sofasDataPath, 'utf8');
    console.log('Raw data read:', data);
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      console.log('Parsed data:', parsedData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      // If the file is corrupted, reset it
      const initialData = { items: [], types: [] };
      fs.writeFileSync(sofasDataPath, JSON.stringify(initialData, null, 2), 'utf8');
      parsedData = initialData;
    }
    
    // Ensure the response has the correct structure
    if (!parsedData || typeof parsedData !== 'object') {
      console.error('Invalid data structure:', parsedData);
      parsedData = { items: [], types: [] };
    }
    
    if (!Array.isArray(parsedData.items)) {
      console.error('Items is not an array:', parsedData.items);
      parsedData.items = [];
    }
    
    if (!Array.isArray(parsedData.types)) {
      console.error('Types is not an array:', parsedData.types);
      parsedData.types = [];
    }
    
    console.log('Sending response:', parsedData);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in GET /api/sofas:', error);
    return NextResponse.json({ error: 'Failed to read sofas data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/sofas - Received request');
    
    // Parse the request body
    const data = await request.json();
    console.log('POST /api/sofas - Request data:', JSON.stringify(data, null, 2));
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid data format:', data);
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    if (!Array.isArray(data.items)) {
      console.error('Items is not an array:', data.items);
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    if (!Array.isArray(data.types)) {
      console.error('Types is not an array:', data.types);
      return NextResponse.json({ error: 'Types must be an array' }, { status: 400 });
    }

    // Read current data from file
    let currentData;
    try {
      const fileContent = fs.readFileSync(sofasDataPath, 'utf8');
      currentData = JSON.parse(fileContent);
      console.log('Current data from file:', JSON.stringify(currentData, null, 2));
    } catch (error) {
      console.error('Error reading current data:', error);
      currentData = { items: [], types: [] };
    }

    // Merge the new types with existing types
    const updatedData = {
      items: data.items,
      types: Array.from(new Set([...currentData.types, ...data.types]))
    };
    console.log('Updated data to write:', JSON.stringify(updatedData, null, 2));

    // Write the data to the file
    try {
      console.log('Writing data to file:', sofasDataPath);
      fs.writeFileSync(sofasDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log('Data written successfully');
      
      // Verify the data was written correctly
      const writtenData = fs.readFileSync(sofasDataPath, 'utf8');
      console.log('Verification - Data read back:', writtenData);
    } catch (error) {
      console.error('Error writing to sofas_database.json:', error);
      return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error in POST /api/sofas:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 