import type { NextRequest } from 'next/server';
import { minioClient } from '@/utils/file-management';
import ENV from '@/lib/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('No id provided', { status: 400 });
  }

  try {
    const stream = await minioClient.getObject(ENV.S3_BUCKET_NAME!, id);

    if (!stream) {
      return new Response('File not found', { status: 404 });
    }

    const contentType = getContentType(id);

    return new Response(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('MinIO fetch error:', err);
    return new Response('Error fetching image', { status: 500 });
  }
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}
