import { NextResponse } from 'next/server';

// This is a placeholder for your actual data source
// You should replace this with your database or data fetching logic
const getSubCategoryItems = async (category, subcategory) => {
  // Example data structure
  return [
    {
      id: '1',
      name: 'Սեղան 1',
      code: 'TBL001',
      price: '150,000 դր',
      available: true,
      imageUrl: '/images/tables/table1.jpg',
      url: `/furniture/${category}/${subcategory}/1`
    },
    {
      id: '2',
      name: 'Սեղան 2',
      code: 'TBL002',
      price: '200,000 դր',
      available: false,
      imageUrl: '/images/tables/table2.jpg',
      url: `/furniture/${category}/${subcategory}/2`
    },
    // Add more items as needed
  ];
};

export async function GET(request, { params }) {
  try {
    const items = await getSubCategoryItems(params.category, params.subcategory);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subcategory items' },
      { status: 500 }
    );
  }
} 