import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    // ランダムID生成
    const id = Math.random().toString(36).substring(2, 10);

    // KVに保存（30日間有効）
    await kv.set(`share:${id}`, imageUrl, { ex: 60 * 60 * 24 * 30 });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
