import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import type { Product, ProductFilters } from '@/types';

// GET search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query && !category) {
      return NextResponse.json({ products: [], totalResults: 0 });
    }

    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    const filter: Record<string, unknown> = {};

    // Search query
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { shortDescription: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }

    // Category filter
    if (category) {
      filter.categorySlug = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        (filter.price as Record<string, number>).$gte = Number(minPrice);
      }
      if (maxPrice) {
        (filter.price as Record<string, number>).$lte = Number(maxPrice);
      }
    }

    // Stock filter
    if (inStock === 'true') {
      filter.inStock = true;
    }

    // Sorting
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      case 'best_selling':
        sortOptions = { isBestSelling: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productsCollection
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray(),
      productsCollection.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      totalResults: total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
