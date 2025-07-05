import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { options } from '../api/auth/[...nextauth]/options';
import LogoutButton from '../logout/page';
import ButtonComponent from './button';

const Navbar = async () => {
    const session = await getServerSession(options);
    console.log('Navbar ', session);

    return (
        <nav className="bg-white text-black  shadow-md">
            <div className="w-full  mx-auto flex justify-between items-center py-4">
                <div className=" w-[30%] text-2xl font-bold pl-12">
                    <Link href="/">MySite</Link>
                </div>
                <div className="space-x-6 w-[40%] flex items-center justify-center ">
                    <Link href="/" className="hover:text-gray-400 transition">
                        Home
                    </Link>
                    <Link href="/about" className="hover:text-gray-400 transition">
                        About
                    </Link>

                    <Link href="/admin" className="hover:text-gray-400 transition">
                        Admin
                    </Link>
                    <Link href="/superadmin" className="hover:text-gray-400 transition">
                        SuperAdmin
                    </Link>
                </div>
                <div className="w-[30%] flex gap-6 justify-end items-center pr-12">
                    {session ? null : (
                        <Link href="/signup" className="hover:text-gray-400 transition">
                            <ButtonComponent buttonText={'Signup'} />
                        </Link>
                    )}
                    {session ? (
                        <Link href="/api/auth/signout?callbackUrl=/">
                            <LogoutButton />{' '}
                        </Link>
                    ) : (
                        <Link href="/api/auth/signin?callbackUrl=/">
                            <ButtonComponent buttonText={'LogIn'} />{' '}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
