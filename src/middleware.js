import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req });
    console.log('middleware runnig :', token);
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/tasks')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    if (pathname.startsWith('/leave')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    // Protect /admin route
    if (pathname.startsWith('/admin')) {
        if (!token) {
            // Not logged in → redirect to login
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'admin') {
            // Logged in, but not admin → redirect to restricted
            return NextResponse.redirect(new URL('/restricted', req.url));
        }
    }

    // Protect /superadmin route
    if (pathname.startsWith('/superadmin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (token.role !== 'superadmin') {
            return NextResponse.redirect(new URL('/restricted', req.url));
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*', '/tasks', '/leave'],
};
