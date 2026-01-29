export const config = {
  MINIO_ENDPOINT: process.env['FSMS_MINIO_ENDPOINT'] ?? '',
  MINIO_PORT: Number(process.env['FSMS_MINIO_PORT']),
  MINIO_ACCESS_KEY: process.env['FSMS_MINIO_ACCESS_KEY'] ?? '',
  MINIO_SECRET_KEY: process.env['FSMS_MINIO_SECRET_KEY'] ?? '',
  MINIO_BUCKET: process.env['FSMS_MINIO_BUCKET'] ?? '',
};
