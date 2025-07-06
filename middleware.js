'use client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req });
    console.log('midle token', token);
    const url = req.nextUrl.pathname;

    if (url.startsWith('/admin') && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/ ', req.url));
    }

    if (url.startsWith('/superadmin') && token?.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*'],
};
