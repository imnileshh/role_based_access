import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const token = cookies().get('token')?.value;
    // console.log(token);
    if (!token) {
        return NextResponse.json(
            {
                error: 'Please Login First',
            },
            { status: 401 }
        );
    }
    try {
        const response = NextResponse.json({ message: 'LogOut Successful' });
        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        return response;
    } catch (error) {
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}
