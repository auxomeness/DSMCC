export class UploadService {
  getPublicImageUrl(filename: string) {
    return `/uploads/${filename}`;
  }
}

export const uploadService = new UploadService();
