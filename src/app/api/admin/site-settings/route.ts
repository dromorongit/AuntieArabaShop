import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdminSession } from '@/lib/auth';

// Site settings interface
interface SiteSettings {
  _id?: string;
  siteLocked: boolean;
  lockHeading: string;
  lockMessage: string;
  enableCountdown: boolean;
  countdownDateTime: string | null;
  backgroundImage: string;
  updatedAt: Date;
}

// Default settings
const defaultSettings: SiteSettings = {
  siteLocked: false,
  lockHeading: 'We Are Coming Soon',
  lockMessage: 'We are preparing something extraordinary for you. Stay tuned!',
  enableCountdown: false,
  countdownDateTime: null,
  backgroundImage: '/LADYSTANDARD.PNG',
  updatedAt: new Date(),
};

// GET - Fetch site settings (public endpoint for middleware)
export async function GET(request: NextRequest) {
  try {
    // Allow middleware bypass
    const isMiddlewareBypass = request.headers.get('x-middleware-bypass') === 'true';
    
    const db = await getDatabase();
    const settingsCollection = db.collection<SiteSettings>('siteSettings');

    let settings = await settingsCollection.findOne({});

    if (!settings) {
      // Create default settings if none exist
      const result = await settingsCollection.insertOne(defaultSettings);
      settings = { ...defaultSettings, _id: result.insertedId.toString() };
    }

    // Check if countdown has expired and auto-unlock
    if (settings.siteLocked && settings.enableCountdown && settings.countdownDateTime) {
      const countdownEnd = new Date(settings.countdownDateTime).getTime();
      const now = Date.now();
      
      if (now >= countdownEnd) {
        // Auto-unlock when countdown reaches zero
        await settingsCollection.updateOne(
          {},
          { $set: { siteLocked: false, updatedAt: new Date() } }
        );
        settings = { ...settings, siteLocked: false };
      }
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings (temporarily without auth for testing)
export async function PUT(request: NextRequest) {
  try {
    // Auth disabled for testing - re-enable in production
    // const session = await verifyAdminSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      siteLocked,
      lockHeading,
      lockMessage,
      enableCountdown,
      countdownDateTime,
      backgroundImage,
    } = body;

    console.log('Saving site settings:', { siteLocked, lockHeading });

    const db = await getDatabase();
    const settingsCollection = db.collection<SiteSettings>('siteSettings');

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (siteLocked !== undefined) updateData.siteLocked = siteLocked;
    if (lockHeading !== undefined) updateData.lockHeading = lockHeading;
    if (lockMessage !== undefined) updateData.lockMessage = lockMessage;
    if (enableCountdown !== undefined) updateData.enableCountdown = enableCountdown;
    if (countdownDateTime !== undefined) updateData.countdownDateTime = countdownDateTime;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;

    await settingsCollection.updateOne({}, { $set: updateData }, { upsert: true });

    console.log('Settings saved successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
