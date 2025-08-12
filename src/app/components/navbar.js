'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaComments, FaProjectDiagram, FaTasks } from 'react-icons/fa';

const menuItems = [
    { name: 'Dashboard', icon: <FaProjectDiagram />, href: '/home' },
    { name: 'Project', icon: <FaProjectDiagram />, href: '/project' },
    { name: 'My Task', icon: <FaTasks />, href: '/tasks' },
    { name: 'Calendar', icon: <FaCalendarAlt />, href: '/calendar' },
    { name: 'Leaves', icon: <FaCalendarAlt />, href: '/leave' },
    { name: 'Conversation', icon: <FaComments />, href: '/conversation' },
];

export default function Sidebar() {
    const [active, setActive] = useState('My Task');
    const { data: session } = useSession();
    const [employeeName, setEmployeeName] = useState('username');

    useEffect(() => {
        if (session) {
            setEmployeeName(session.user.name);
        }
    }, [session]);

    return (
        <aside className="flex flex-col justify-between bg-[#0e0e12] text-white w-64 h-screen p-4 border-r border-gray-800">
            <div>
                <div className="flex items-center gap-2 mb-8 px-2">
                    <span className="text-purple-500 text-2xl font-bold">⚡</span>
                    <span className="text-lg font-semibold">Task Management</span>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                    {menuItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActive(item.name)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                active === item.name
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-6 px-2">
                <Image
                    src="/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.jpg"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div className="flex-1">
                    <p className="text-sm font-medium">{employeeName || 'Unknwon User'}</p>
                </div>
                {session ? (
                    <div className="space-y-3">
                        <Link
                            href="/api/auth/signout?callbackUrl=/"
                            className="block  bg-purple-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-purple-500"
                            aria-label="Sign out"
                        >
                            LogOut
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Link
                            href="/signup"
                            className="block   bg-purple-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-purple-500"
                            aria-label="Sign up for an account"
                        ></Link>
                        <Link
                            href="/api/auth/signin?callbackUrl=/"
                            className="block   bg-purple-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-purple-500"
                            aria-label="Sign in to your account"
                        ></Link>
                    </div>
                )}
            </div>
        </aside>
    );
}
