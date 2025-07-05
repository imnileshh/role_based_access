'use client';

import { useSession } from 'next-auth/react';
function About() {
    // const session = await getServerSession(options);
    // console.log('Your Session is:', session);
    // if (session?.user?.role !== 'admin') {
    //     redirect('/restricted');
    // }
    const { data: session } = useSession({
        required: false,
        // onUnauthenticated() {
        //     redirect('/api/auth/signin?callbackUrl=/about');
        // },
    });
    return (
        <div>
            <h1 className="text-white">This is about page</h1>
            <p className="text-gray-300">
                {session?.user?.email
                    ? `Logged in as ${session.user.email}`
                    : 'You are not logged in'}
            </p>
        </div>
    );
}

export default About;
