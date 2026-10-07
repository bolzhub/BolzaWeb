import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ avatar: null }, { status: 400 });

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 60 * 60 * 24 * 7 },
        });
        if (!res.ok) return NextResponse.json({ avatar: null });
        const html = await res.text();
        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        return NextResponse.json({ avatar: match ? match[1] : null });
    } catch {
        return NextResponse.json({ avatar: null });
    }
}