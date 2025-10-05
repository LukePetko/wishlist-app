import z from 'zod';

const envSchema = z.object({
  S3_BUCKET_NAME: z.string(),
  S3_ENDPOINT: z.string(),
  S3_PORT: z.coerce.number().default(9000),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_USE_SSL: z.string().default('true'),
  DB_URL: z.string(),
  ORDER_MODE_PASSWORD: z.string(),
});

const ENV = envSchema.parse(process.env);

export default ENV;
