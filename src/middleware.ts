import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("loginToken")?.value;
  if (!cookie) {
    return NextResponse.redirect("https://nosh-nft.vercel.app/login");
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload-item",
    "/account",
    "/nft",
    "/create-collection",
    "/my-collection",
  ],
};
