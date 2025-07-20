import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT!,
  port: Number(process.env.S3_PORT!),
  accessKey: process.env.S3_ACCESS_KEY!,
  secretKey: process.env.S3_SECRET_KEY!,
  useSSL: process.env.S3_USE_SSL === "true",
});
