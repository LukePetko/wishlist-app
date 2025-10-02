import ENV from "@/lib/env";
import { cookies } from "next/headers";

export async function POST(req: Request) {
	const body = await req.json();
	const awaitedCookie = await cookies();

	if (body.password !== ENV.ORDER_MODE_PASSWORD) {
		return new Response("Invalid password", { status: 401 });
	}

	awaitedCookie.set("token", body.password, {
		httpOnly: true,
		secure: true,
		path: "/",
	});

	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
