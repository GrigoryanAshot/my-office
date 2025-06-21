import { NextResponse } from 'next/server';
import { categories } from '@/component/Lists/furniture/categories';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    // Map the URL parameter to the correct category key
    const categoryKey = category === 'tables' ? 'furniture_tables' : 
                       category === 'chairs' ? 'furniture_chairs' : 
                       `furniture_${category}`;
    
    const categoryData = categories[categoryKey];

    if (!categoryData) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // This is a placeholder for actual data fetching
    // In a real application, you would fetch this data from a database
    const items = [
      {
        id: 1,
        name: 'Sample Item 1',
        code: 'CODE001',
        price: '100,000 AMD',
        available: true,
        imageUrl: 'https://example.com/image1.jpg',
        url: `/furniture/${category}/1`
      },
      {
        id: 2,
        name: 'Sample Item 2',
        code: 'CODE002',
        price: '150,000 AMD',
        available: false,
        imageUrl: 'https://example.com/image2.jpg',
        url: `/furniture/${category}/2`
      }
    ];

    return NextResponse.json({
      items,
      categoryName: categoryData.name
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 