import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

export async function getUserFromRequest(req) {
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.split(' ')[1];

    let token = null;

    try {
        if (bearerToken) {
            const { payload } = await jwtVerify(
                bearerToken,
                new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
            );
            token = payload;
        } else {
            token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        }

        if (!token) return null;

        return {
            id: token?.tokenData?.id || token?.id,
            email: token?.tokenData?.email || token?.email,
            name: token?.tokenData?.name || token?.name,
            role: token?.tokenData?.role || token?.role,
        };
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
}
