'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const email = session.user?.email;
            if (email === 'yadavnil2004@gmail.com') {
                router.push('/admin');
            } else if (email === 'nilesh.213779101@vcet.edu.in') {
                router.push('/superadmin');
            } else {
                router.push('/');
            }
        }
    }, [status, session, router]);

    return <p className="text-center mt-10 text-white">Redirecting...</p>;
}
