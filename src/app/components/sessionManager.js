'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SessionManager() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/login') {
            console.log('Session expired. Logging out...');
            router.replace('/login');
        }
    }, [status, pathname]);

    return null;
}
