import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        console.log('✅ Middleware running on:', req.nextUrl.pathname);

        const token = req.nextauth.token;
        console.log('🔐 Token:', token);

        // Role-based restriction
        if (req.nextUrl.pathname.startsWith('/about') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/restricted', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ['/about/:path*'],
};

// import { jwtVerify } from 'jose';
// import { NextResponse } from 'next/server';

// export async function middleware(req) {
//     const path = req.nextUrl.pathname;
//     // const publicUrl = path === '/' || path === '/login' || path === '/signup';
//     const publicPaths = ['/', '/login', '/signup'];
//     const isPublicPath = publicPaths.includes(path);
//     const token = req.cookies.get('token')?.value;
//     console.log(token);

//     // ✅ Allow public pages without token
//     if (isPublicPath && !token) {
//         return NextResponse.next();
//     }
//     if (!isPublicPath && !token) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     if (token) {
//         try {
//             const { payload } = await jwtVerify(
//                 token,
//                 new TextDecoder().encode(process.env.JWT_SECRET)
//             );
//             console.log('Token Verified:', payload);
//             const role = payload.role;

//             if (path.startsWith('/admin') && role !== 'admin') {
//                 return NextResponse.redirect(new URL('/admin', req.url));
//             }
//             if (path.startsWith('/superadmin') && role !== 'superadmin') {
//                 return NextResponse.redirect(new URL('/unauthorized', req.url));
//             }
//             return NextResponse.next();
//         } catch (error) {
//             console.error('Token Verification Failed:', error);
//             const isTokenExpired = error.code === 'ERR_JWT_EXPIRED';

//             // user is on public url and token expired
//             if (publicUrl && isTokenExpired) {
//                 console.log('Token expired on public path');
//                 return NextResponse.next();
//             }
//         }
//         // token is there but invalid or expired
//         return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
//     }

//     // last case if user is on public page and no token is there
//     // no login is required so he can continue
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ['/', '/login', '/signup', '/dashboard', '/admin'],
// };
