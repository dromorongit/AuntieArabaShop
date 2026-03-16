import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Product } from '@/types';
import { ObjectId } from 'mongodb';

// GET a single product by ID (public - no auth required)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    // Try to find by ObjectId first (for MongoDB _id)
    let product: Product | null = null;
    
    try {
      if (ObjectId.isValid(id)) {
        product = await productsCollection.findOne({ _id: new ObjectId(id) } as Partial<Product>);
      }
    } catch {
      // If ObjectId parsing fails, try finding by string _id
    }

    // If not found by ObjectId, try finding by string _id
    if (!product) {
      product = await productsCollection.findOne({ _id: id } as Partial<Product>);
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
