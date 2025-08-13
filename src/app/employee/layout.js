'use client';

import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/navbar';

export default function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0e0e12] text-white">
            {/* Mobile top bar with hamburger (hidden on md+) */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10">
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="p-2 rounded-md bg-purple-600 text-white"
                >
                    <FaBars size={18} />
                </button>

                <div className="text-lg font-semibold">Text</div>
            </header>

            <div className="flex min-h-screen">
                {/* Sidebar receives control props for mobile open/close */}
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

                {/* Main content / dashboard area */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
