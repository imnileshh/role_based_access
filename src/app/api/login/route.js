import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../../../../models/user';
import { dbConnect } from '../../components/lib/dbconnect';

export async function POST(req) {
    try {
        dbConnect();
        const { email, password } = await req.json();

        // check if  user exists
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return NextResponse.json({ error: 'User Do Not Exists' }, { status: 400 });
        }
        console.log(existingUser);

        // password check

        const passwordCheck = await bcrypt.compare(password, existingUser.password);
        if (!passwordCheck) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const tokenData = {
            id: existingUser._id,
            email: existingUser.email,
            username: existingUser.name,
            role: existingUser.role,
        };

        const token = await jwt.sign(
            {
                tokenData,
            },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: '1d' }
        );
        console.log('login', token);

        const response = NextResponse.json({
            message: 'Login Successful',
            success: true,
        });

        response.cookies.set('token', token, { httpOnly: true });
        return response;
    } catch (error) {
        return NextResponse.json({
            error: error.message,
            status: 500,
        });
    }
}
