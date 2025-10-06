'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaProjectDiagram, FaTasks, FaTimes } from 'react-icons/fa';

const menuItems = [
    { name: 'Dashboard', icon: <FaProjectDiagram />, href: '/employee' },
    { name: 'Project', icon: <FaProjectDiagram />, href: '/employee/project' },
    { name: 'MyTask', icon: <FaTasks />, href: '/employee/tasks' },
    { name: 'Calendar', icon: <FaCalendarAlt />, href: '/employee/calendar' },
    { name: 'Leaves', icon: <FaCalendarAlt />, href: '/employee/leave' },
];

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }) {
    const pathname = usePathname();
    const [active, setActive] = useState('');
    const { data: session } = useSession();
    const [employeeName, setEmployeeName] = useState('username');

    useEffect(() => {
        if (session) {
            setEmployeeName(session.user.name);
        }
        if (pathname) {
            const match = menuItems.find(path => path.href === pathname);
            if (match) {
                setActive(match.name);
            }
        }
    }, [session, pathname]);

    return (
        <>
            {/* Sidebar — slides in on mobile, static on md+ */}
            <aside
                className={`fixed top-0 left-0 min-h-screen w-64 bg-[#0e0e12] text-white p-4 border-r border-gray-600 z-50 transform transition-transform duration-300${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:w-64`}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-purple-500 text-2xl font-bold">⚡</span>
                        <span className="text-lg font-semibold">Task Management</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="p-2 rounded-md bg-white/10"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Desktop header (hidden on mobile because mobile has topbar) */}
                <div className="hidden lg:block mb-6">
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-purple-500 text-2xl font-bold">⚡</span>
                        <span className="text-lg font-semibold">Text</span>
                    </div>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                    {menuItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                                setActive(item.name);
                                setIsOpen(false);
                            }}
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

                {/* User section */}
                <div className="flex items-center gap-3 mt-6 px-2">
                    <Image
                        src="/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.jpg"
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{employeeName || 'Unknown User'}</p>
                    </div>

                    {/* Example logout button - replace href with your signout route */}
                    {session ? (
                        <div className="space-y-3">
                            <Link
                                href="/api/auth/signout"
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
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Backdrop on mobile when sidebar open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
