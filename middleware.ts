import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Ensure cookies are correctly handled for auth refresh and session sync
  // This is a common fix for CSRF 403 errors when the frontend and backend are on different domains
  // but communicating via cross-origin cookies.
  
  const origin = request.headers.get('origin');
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/app/:path*'],
};
