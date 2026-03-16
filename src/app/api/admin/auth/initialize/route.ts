import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/auth';

export async function POST() {
  try {
    await initializeAdmin();
    return NextResponse.json({ success: true, message: 'Admin initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize admin:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    );
  }
}
