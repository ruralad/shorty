import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname === "/"
  ) {
    return;
  }
  const slug = req.nextUrl.pathname.split("/").pop();

  const slugFetch = await fetch(`${req.nextUrl.origin}/api/fetchUrl/${slug}`);
  if (slugFetch.status === 404) {
    return NextResponse.redirect(req.nextUrl.origin);
  }
  const data = await slugFetch.json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}
