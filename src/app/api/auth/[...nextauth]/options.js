import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { default as GitHubProvider } from 'next-auth/providers/github';
import User from '../../../../../models/user';
import dbConnect from '../../../../lib/dbconnect';

export const options = {
    // adapter:MongoDBAdapter(clientPromise),
    secrets: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text', placeholder: 'Enter Email' },
                password: { label: 'password', type: 'password', placeholder: 'Enter Password' },
            },
            async authorize(credentials, req) {
                await dbConnect();

                const { email, password } = credentials;

                const findUser = await User.findOne({ email: email });
                if (!findUser) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(password, findUser.password);
                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: findUser._id,
                    name: findUser.name,
                    email: findUser.email,
                    role: findUser.role,
                };
            },
        }),

        GitHubProvider({
            profile(profile) {
                console.log('github Profile:', profile);

                let userrole = 'user';
                if (profile?.email === 'nilesh.213779101@vcet.edu.in') {
                    userrole = 'admin';
                }
                return {
                    id: profile.id.toString(),
                    name: profile.name?.trim() || 'unknown user',
                    email: profile.email,
                    role: userrole || 'user',
                };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();

            if (account.provider !== 'credentials') {
                if (!profile?.email) return false;
                const userExist = await User.findOne({ email: profile.email });
                if (!userExist) {
                    let userrole = 'user';
                    if (profile.email === 'yadavnil2004@gmail.com') {
                        userrole = 'admin';
                    }
                    const newUser = await User.create({
                        email: profile.email,
                        name: profile.name?.trim() || 'Unknown User',
                        role: userrole || 'user',
                    });

                    console.log(`New user created: ${profile.email}`);
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role || 'user';
            }
            return session;
        },
    },
};
