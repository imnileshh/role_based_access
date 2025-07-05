'use client';
import { IconBrandGithub } from '@tabler/icons-react';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function LoginUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        email: '',
        password: '',
    });
    const handleChange = e => {
        setFormdata({ ...formdata, [e.target.id]: e.target.value });
    };
    const validate = () => {
        const newErrors = {};
        if (!formdata.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email))
            newErrors.email = 'Email is invalid';
        if (!formdata.password.trim()) newErrors.password = 'Password is required';
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) {
            alert('Enter valid Credentials');
            return;
        }
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formdata.email,
                password: formdata.password,
            });

            console.log('Response Data:', result);
            if (result?.error) {
                alert(result.error); // shows Invalid credentials
            } else {
                const session = await getSession();
                if (session?.user?.email === 'yadavnil2004@gmail.com') {
                    router.push('/admin');
                }
                if (session?.user?.email === 'nilesh.213779101@vcet.edu.in') {
                    router.push('/admin');
                }
                router.push('/');
            }
        } catch (error) {
            setLoading(false);
            console.error('Registration error:', error);
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-20 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                Welcome
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center ">
                Enter Your Login Credentials
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                        value={formdata.email}
                        onChange={handleChange}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="password"
                        type="password"
                        value={formdata.password}
                        onChange={handleChange}
                    />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                >
                    {loading ? <p>Please Wait...</p> : <p> Log In &rarr;</p>}
                    <BottomGradient />
                </button>
            </form>
            <p className="text-white text-center mb-4">Or</p>

            <button
                type="button"
                onClick={() => signIn('github', { callbackUrl: '/auth-redirect' })}
                className=" group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">GitHub</span>
                <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            <div className="flex flex-row justify-center items-center gap-2 text-white">
                <p>Don't have an account</p>
                <Link className="text-blue-600" href={'/signup'}>
                    SignUp
                </Link>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({ children, className }) => {
    return <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>;
};
