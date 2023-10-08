import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("loginToken")?.value;
  if (!cookie) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload-item",
    "/account",
    "/author",
    "/nft",
    "/create-collection",
    "/my-collection",
    "/collection",
  ],
};
