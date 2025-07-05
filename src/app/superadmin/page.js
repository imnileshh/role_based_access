'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function SuperAdmin() {
    const { data: session, status } = useSession();
    if (session?.user?.email !== 'nilesh.213779101@vcet.edu.in') {
        redirect('/restricted');
    }

    return (
        <div>
            <h1 className="text-4xl text-white">This is Super Admin page</h1>
        </div>
    );
}

export default SuperAdmin;
