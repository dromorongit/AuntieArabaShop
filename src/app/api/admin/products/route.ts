import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import type { Product, ProductVariant } from '@/types';

// GET all products (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.categorySlug = category;
    }

    if (inStock === 'true') {
      query.inStock = true;
    } else if (inStock === 'false') {
      query.inStock = false;
    }

    const skip = (page - 1) * limit;
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [products, total] = await Promise.all([
      productsCollection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray(),
      productsCollection.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      shortDescription,
      description,
      price,
      discountPrice,
      images,
      category,
      categorySlug,
      inStock,
      stock,
      variants,
      tags,
      sizes,
      colors,
      isFeatured,
      isBestSelling,
    } = body;

    if (!name || !price || !category || !categorySlug) {
      return NextResponse.json(
        { error: 'Name, price, category are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    const product = {
      name: name as string,
      shortDescription: (shortDescription || '') as string,
      description: (description || '') as string,
      price: Number(price) as number,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      images: (images || []) as string[],
      category: category as string,
      categorySlug: categorySlug as string,
      inStock: (inStock ?? true) as boolean,
      stock: stock ? Number(stock) : undefined,
      variants: (variants || []) as ProductVariant[],
      tags: (tags || []) as string[],
      sizes: (sizes || []) as string[],
      colors: (colors || []) as string[],
      isFeatured: (isFeatured ?? false) as boolean,
      isBestSelling: (isBestSelling ?? false) as boolean,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(product);

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      shortDescription,
      description,
      price,
      discountPrice,
      images,
      category,
      categorySlug,
      inStock,
      stock,
      variants,
      tags,
      sizes,
      colors,
      isFeatured,
      isBestSelling,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    const updateData: Partial<Product> = {
      ...(name && { name }),
      shortDescription: shortDescription !== undefined ? shortDescription : undefined,
      description: description !== undefined ? description : undefined,
      ...(price && { price: Number(price) }),
      ...(discountPrice !== undefined && { discountPrice: discountPrice ? Number(discountPrice) : null }),
      ...(images && { images }),
      ...(category && { category }),
      ...(categorySlug && { categorySlug }),
      ...(inStock !== undefined && { inStock }),
      ...(stock !== undefined && { stock: stock ? Number(stock) : null }),
      ...(variants && { variants }),
      ...(tags && { tags }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isBestSelling !== undefined && { isBestSelling }),
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof Product] === undefined) {
        delete updateData[key as keyof Product];
      }
    });

    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const productsCollection = db.collection<Product>('products');

    await productsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
