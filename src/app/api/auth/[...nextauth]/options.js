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

                return {
                    id: profile.id.toString(),
                    name: profile.name?.trim() || 'unknown user',
                    email: profile.email,
                    role: 'user',
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
                    await User.create({
                        email: profile.email,
                        name: profile.name?.trim() || 'Unknown User',
                        role: 'user',
                    });

                    console.log(`New user created: ${profile.email}`);
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            await dbConnect();

            // Always get fresh user data from DB by email
            const dbUser = await User.findOne({ email: token.email?.toLowerCase() });
            if (dbUser) {
                token.role = dbUser.role;
                token.name = dbUser.name;
                token.email = dbUser.email;
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
