import { minioClient } from "@/utils/file-management";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  if (!id) {
    return new Response("No id provided", { status: 400 });
  }

  console.log(id);

  const presignedUrl = await minioClient.presignedUrl(
    "GET",
    process.env.S3_BUCKET_NAME!,
    id,
    24 * 60 * 60,
  );

  return new Response(JSON.stringify({ url: presignedUrl }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
