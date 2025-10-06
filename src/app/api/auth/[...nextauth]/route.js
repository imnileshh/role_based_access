// app/api/auth/[...nextauth]/route.js
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import User from '../../../../../models/user';
import { dbConnect } from '../../../components/lib/dbconnect';

const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 12,
        updateAge: 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await dbConnect();
                const { email, password } = credentials || {};
                const user = await User.findOne({ email }).select('+password');
                if (!user) throw new Error('No user with that email');
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error('Bad password');
                return { id: user._id, name: user.name, email: user.email, role: user.role };
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name?.trim() || 'GitHub User',
                    email: profile.email,
                    role: 'user',
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider !== 'credentials') {
                await dbConnect();
                if (!profile?.email) return false;
                const exists = await User.findOne({ email: profile.email });
                if (!exists) {
                    await User.create({
                        email: profile.email,
                        name: profile.name?.trim() || 'New User',
                        role: 'user',
                    });
                }
            }
            return true;
        },
        async jwt({ token }) {
            await dbConnect();
            const dbUser = await User.findOne({ email: token.email?.toLowerCase() });
            if (dbUser) {
                token.id = dbUser._id.toString();
                token.role = dbUser.role;
                token.name = dbUser.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
