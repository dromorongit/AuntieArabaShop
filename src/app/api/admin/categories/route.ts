import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import type { Category } from '@/types';

// GET all categories
export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>('categories');

    const categories = await categoriesCollection
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, image, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>('categories');

    // Check if slug already exists
    const existingCategory = await categoriesCollection.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    const category: Partial<Category> = {
      name,
      slug,
      description: description || '',
      image: image || '',
      isActive: isActive ?? true,
    };

    const result = await categoriesCollection.insertOne(category as Category);

    return NextResponse.json({
      success: true,
      categoryId: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, description, image, isActive } = body;

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: 'ID, name, and slug are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>('categories');

    await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          slug,
          description: description || '',
          image: image || '',
          isActive: isActive ?? true,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category
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
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const categoriesCollection = db.collection<Category>('categories');

    await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
