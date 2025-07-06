'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuperAdmin() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        const email = session?.user?.email;
        const role = session?.user?.role;

        if (email !== 'nilesh.213779101@vcet.edu.in' || role !== 'superadmin') {
            router.replace('/restricted');
        } else {
            setIsAuthorized(true);
        }
    }, [session, status, router]);

    if (status === 'loading' || !isAuthorized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-lg">Checking access...</p>
            </div>
        );
    }

    return (
        <div>
            {isAuthorized && <h1 className="text-4xl text-white">This is Super Admin page</h1>}
        </div>
    );
}
