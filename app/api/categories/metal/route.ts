import { NextResponse } from 'next/server';
import { categories } from '@/component/Lists/metal/categories';

export async function GET() {
  try {
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metal categories' },
      { status: 500 }
    );
  }
} 