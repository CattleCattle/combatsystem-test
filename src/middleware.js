import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "e4a8eef1-6fee-4bc2-a472-0ede2956db3f");
  requestHeaders.set("x-createxyz-project-group-id", "5ba7aa1f-9301-4e2b-bc8e-07ba3a6a6826");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}