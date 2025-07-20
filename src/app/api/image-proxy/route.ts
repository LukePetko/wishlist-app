export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) return new Response("Missing url", { status: 400 });

  const res = await fetch(imageUrl);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  return new Response(res.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
