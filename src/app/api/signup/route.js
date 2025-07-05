import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '../../../../models/user';
import dbConnect from '../../../lib/dbconnect';

export async function POST(req) {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
        return NextResponse.json(
            {
                error: 'Enter Full Credentials',
            },
            { status: 400 }
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json(
            {
                error: 'This User Already exits ',
            },
            {
                status: 400,
            }
        );
    }

    // HAsh the password
    const hashhedPassword = await bcrypt.hash(password, 10);

    // create entry in Db

    const userCreated = await User.create({
        name,
        email,
        password: hashhedPassword,
        role: 'user',
    });

    if (!userCreated) {
        return NextResponse.json(
            {
                error: 'Failed to create user',
            },
            {
                status: 500,
            }
        );
    }

    return NextResponse.json({
        message: 'User created!',
        success: true,
        userCreated,
    });
}
