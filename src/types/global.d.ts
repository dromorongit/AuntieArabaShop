/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Global type declarations
declare global {
  // For MongoDB client promise
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  
  // Node.js process
  var process: {
    env: {
      NODE_ENV: 'development' | 'production' | 'test';
      MONGODB_URI: string;
      NEXT_PUBLIC_APP_URL: string;
      JWT_SECRET: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      [key: string]: string | undefined;
    };
  };
  
  // Node.js global
  var global: typeof globalThis;
}

export {};
