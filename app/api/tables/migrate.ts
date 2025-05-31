const fs = require('fs');
const path = require('path');

interface FurnitureItem {
  id: number;
  name: string;
  type: string;
  price: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

const oldDataPath = path.join(process.cwd(), 'data', 'furniture_tables.json');
const newDataPath = path.join(process.cwd(), 'data', 'tables_data.json');

// Read old data
const oldData: FurnitureItem[] = JSON.parse(fs.readFileSync(oldDataPath, 'utf8'));

// Extract unique types
const types = Array.from(new Set(oldData.map((item: FurnitureItem) => item.type)));

// Create new data structure
const newData = {
  items: oldData,
  types: types
};

// Write new data
fs.writeFileSync(newDataPath, JSON.stringify(newData, null, 2));

console.log('Migration completed successfully'); 