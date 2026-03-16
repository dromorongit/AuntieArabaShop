import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import type { Admin, AdminSession } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'auntie-araba-shop-secret-key-2024'
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@auntiearaba.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function createAdminSession(admin: Admin): Promise<string> {
  const token = await new SignJWT({
    adminId: admin._id?.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Initialize default admin if not exists
export async function initializeAdmin(): Promise<void> {
  try {
    const db = await getDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    
    const existingAdmin = await adminsCollection.findOne({ email: ADMIN_EMAIL });
    
    if (!existingAdmin) {
      const passwordHash = await hashPassword(ADMIN_PASSWORD);
      await adminsCollection.insertOne({
        email: ADMIN_EMAIL,
        password: passwordHash,
        name: 'Admin',
        role: 'super_admin',
        createdAt: new Date(),
      });
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<Admin | null> {
  try {
    const db = await getDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    
    const admin = await adminsCollection.findOne({ email });
    
    if (!admin) return null;
    
    const isValid = await verifyPassword(password, admin.password);
    
    if (!isValid) return null;
    
    return admin;
  } catch {
    return null;
  }
}

export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    const db = await getDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    
    const admin = await adminsCollection.findOne({ 
      _id: new ObjectId(id)
    });
    
    return admin;
  } catch {
    return null;
  }
}
