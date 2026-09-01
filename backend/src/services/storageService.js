import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

class StorageService {
  constructor() {
    this.s3Client = null;
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.initS3();
  }

  initS3() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || 'ap-south-1';
    const endpoint = process.env.AWS_S3_ENDPOINT; // For Cloudflare R2 / MinIO / DigitalOcean Spaces

    if (accessKeyId && secretAccessKey && this.bucketName) {
      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        },
        ...(endpoint ? { endpoint, forcePathStyle: true } : {})
      });
      console.log(`[StorageService] S3 Cloud Storage initialized for bucket: ${this.bucketName}`);
    } else {
      this.s3Client = null;
      console.log(`[StorageService] Local disk storage active (uploads directory).`);
    }
  }

  isCloudStorageEnabled() {
    return !!this.s3Client && !!this.bucketName;
  }

  async uploadFile({ buffer, originalname, mimetype, folder = 'documents' }) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(originalname);
    const sanitizedFilename = `${path.basename(originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '')}-${uniqueSuffix}${ext}`;
    const fileKey = `${folder}/${sanitizedFilename}`;

    if (this.isCloudStorageEnabled()) {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: mimetype
        });

        await this.s3Client.send(command);

        const customDomain = process.env.AWS_S3_CUSTOM_DOMAIN;
        const publicUrl = customDomain
          ? `https://${customDomain}/${fileKey}`
          : `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${fileKey}`;

        return {
          fileName: sanitizedFilename,
          fileUrl: publicUrl,
          fileKey,
          storageType: 's3',
          mimeType: mimetype,
          fileSize: buffer.length
        };
      } catch (error) {
        console.error('[StorageService:S3] Upload failed, falling back to local disk:', error.message);
      }
    }

    // Local Disk Storage
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const localFilePath = path.join(uploadDir, sanitizedFilename);
    await fs.promises.writeFile(localFilePath, buffer);

    return {
      fileName: sanitizedFilename,
      fileUrl: `/uploads/${sanitizedFilename}`,
      fileKey: sanitizedFilename,
      storageType: 'local',
      mimeType: mimetype,
      fileSize: buffer.length
    };
  }

  async deleteFile(fileKey) {
    if (!fileKey) return;

    if (this.isCloudStorageEnabled() && fileKey.includes('/')) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey
        });
        await this.s3Client.send(command);
        return { success: true, storageType: 's3' };
      } catch (err) {
        console.error('[StorageService:S3] Delete error:', err.message);
      }
    }

    // Delete local file
    try {
      const localPath = path.join(process.cwd(), 'uploads', path.basename(fileKey));
      if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
      }
      return { success: true, storageType: 'local' };
    } catch (err) {
      console.error('[StorageService:Local] Delete error:', err.message);
      return { success: false, error: err.message };
    }
  }
}

export const storageService = new StorageService();
