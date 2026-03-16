// Cloudinary module declaration
declare module 'cloudinary' {
  export interface Config {
    cloud_name: string;
    api_key: string;
    api_secret: string;
    secure?: boolean;
  }

  export interface UploadResponse {
    public_id: string;
    secure_url: string;
    url: string;
    format: string;
    width?: number;
    height?: number;
  }

  export interface CloudinaryApi {
    config(config: Config): void;
    url(publicId: string, options?: object): string;
    uploader: {
      upload(file: string, options?: object): Promise<UploadResponse>;
      destroy(public_id: string, options?: object): Promise<any>;
    };
  }

  export const v2: CloudinaryApi;
}
