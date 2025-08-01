'use client';
import { IconBrandGithub } from '@tabler/icons-react';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '../components/lib/utils';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function LoginUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const handleChange = e => {
        setFormdata({ ...formdata, [e.target.id]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.id]: '' }));
        setGlobalError('');
    };

    const validate = () => {
        const newErrors = {};
        if (!formdata.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formdata.password.trim()) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formdata.email,
                password: formdata.password,
            });
            console.log('login Result from login page', result);
            if (result?.error) {
                setGlobalError('Invalid credentials');
            } else {
                const session = await getSession();

                const email = session?.user?.email;

                // Role-based redirect
                if (email === 'yadavnil2004@gmail.com') {
                    router.push('/admin');
                } else if (email === 'nilesh.213779101@vcet.edu.in') {
                    router.push('/superadmin');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            setGlobalError('Network error');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-20 shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
                Welcome
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center">
                Enter Your Login Credentials
            </p>

            {globalError && (
                <div className="mt-4 text-sm text-red-500 text-center">{globalError}</div>
            )}

            <form className="my-8" onSubmit={handleSubmit} noValidate>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="projectmayhem@fc.com"
                        value={formdata.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formdata.password}
                        onChange={handleChange}
                        aria-invalid={!!errors.password}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </LabelInputContainer>

                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        'group/btn relative block h-10 w-full rounded-md font-medium text-white transition',
                        'bg-gradient-to-br from-black to-neutral-600 shadow-[inset_0_1px_0_#ffffff40,inset_0_-1px_0_#ffffff40]',
                        'dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[inset_0_1px_0_#27272a,inset_0_-1px_0_#27272a]',
                        loading && 'opacity-60 cursor-not-allowed'
                    )}
                >
                    {loading ? 'Please wait...' : 'Log In →'}
                    <BottomGradient />
                </button>
            </form>

            <p className="text-white text-center mb-4">Or</p>

            <button
                type="button"
                disabled={loading}
                onClick={() => signIn('github')}
                className={cn(
                    'group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black transition',
                    'dark:bg-zinc-900 dark:shadow-[0_0_1px_1px_#262626]',
                    loading && 'opacity-60 cursor-not-allowed'
                )}
            >
                <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">GitHub</span>
                <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-row justify-center items-center gap-2 text-white">
                <p>Don't have an account?</p>
                <Link className="text-blue-600 underline" href="/signup">
                    SignUp
                </Link>
            </div>
        </div>
    );
}

const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);

const LabelInputContainer = ({ children, className }) => (
    <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>
);
