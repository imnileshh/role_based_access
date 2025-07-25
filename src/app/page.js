import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { options } from './api/auth/[...nextauth]/options';

export default async function Home() {
    const session = await getServerSession(options);
    return (
        <main className="h-screen flex flex-col items-center justify-center bg-black text-center">
            <h1 className="text-4xl text-white font-bold mb-4">Welcome to Auth App</h1>
            <div className="space-x-4">
                {!session && (
                    <Link
                        href="/signup"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </Link>
                )}

                {session ? (
                    <Link
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        href="/api/auth/signout?callbackUrl=/"
                    >
                        Logout{' '}
                    </Link>
                ) : (
                    <Link
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        href="/api/auth/signin"
                    >
                        LogIn{' '}
                    </Link>
                )}
            </div>
        </main>
    );
}
