'use client';

import { Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from '../logout/page';
import ButtonComponent from './button';

const NavLink = ({ href, children, className = '', onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
        relative px-3 py-2 transition-colors duration-200
        ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}
        ${className}
      `}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
            )}
        </Link>
    );
};

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Show loading skeleton while session is loading
    if (status === 'loading') {
        return (
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="hidden md:flex space-x-8">
                            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </nav>
        );
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isAdmin = session?.user?.role === 'admin';
    const isSuperAdmin = session?.user?.role === 'superadmin';

    return (
        <nav
            className="bg-white border-b border-gray-200 sticky top-0 z-50"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                            aria-label="MySite homepage"
                        >
                            MySite
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/about">About</NavLink>
                        <NavLink href="/tasks">Tasks</NavLink>
                        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
                        {isSuperAdmin && <NavLink href="/superadmin">SuperAdmin</NavLink>}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!session && (
                            <Link
                                href="/signup"
                                className="hover:opacity-80 transition-opacity duration-200"
                                aria-label="Sign up for an account"
                            >
                                <ButtonComponent buttonText="Sign Up" />
                            </Link>
                        )}
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600 hidden lg:inline">
                                    Welcome, {session.user?.name || session.user?.email}
                                </span>
                                <Link
                                    href="/api/auth/signout?callbackUrl=/"
                                    className="hover:opacity-80 transition-opacity duration-200"
                                    aria-label="Sign out"
                                >
                                    <LogoutButton />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/api/auth/signin?callbackUrl=/"
                                className="hover:opacity-80 transition-opacity duration-200"
                                aria-label="Sign in to your account"
                            >
                                <ButtonComponent buttonText="Sign In" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            onClick={toggleMobileMenu}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink
                            href="/"
                            className="block px-3 py-2 text-base font-medium"
                            onClick={closeMobileMenu}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            href="/about"
                            className="block px-3 py-2 text-base font-medium"
                            onClick={closeMobileMenu}
                        >
                            About
                        </NavLink>
                        {isAdmin && (
                            <NavLink
                                href="/admin"
                                className="block px-3 py-2 text-base font-medium"
                                onClick={closeMobileMenu}
                            >
                                Admin
                            </NavLink>
                        )}
                        {isSuperAdmin && (
                            <NavLink
                                href="/superadmin"
                                className="block px-3 py-2 text-base font-medium"
                                onClick={closeMobileMenu}
                            >
                                SuperAdmin
                            </NavLink>
                        )}
                        <NavLink
                            href="/tasks"
                            className="block px-3 py-2 text-base font-medium"
                            onClick={closeMobileMenu}
                        >
                            Tasks
                        </NavLink>
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="border-t border-gray-200 px-2 pt-4 pb-3 space-y-3">
                        {session ? (
                            <div className="space-y-3">
                                <div className="px-3 py-2">
                                    <p className="text-sm text-gray-600">
                                        Welcome, {session.user?.name || session.user?.email}
                                    </p>
                                </div>
                                <Link
                                    href="/api/auth/signout?callbackUrl=/"
                                    className="block px-3 py-2"
                                    onClick={closeMobileMenu}
                                    aria-label="Sign out"
                                >
                                    <LogoutButton />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/signup"
                                    className="block px-3 py-2"
                                    onClick={closeMobileMenu}
                                    aria-label="Sign up for an account"
                                >
                                    <ButtonComponent buttonText="Sign Up" />
                                </Link>
                                <Link
                                    href="/api/auth/signin?callbackUrl=/"
                                    className="block px-3 py-2"
                                    onClick={closeMobileMenu}
                                    aria-label="Sign in to your account"
                                >
                                    <ButtonComponent buttonText="Sign In" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
