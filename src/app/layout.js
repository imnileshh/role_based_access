import AuthProvider from './components/authProvider';
import Navbar from './components/navbar';
import SessionManager from './components/sessionManager';
import './globals.css';

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <SessionManager />
                    <Navbar />
                    <div>{children}</div>
                </AuthProvider>
            </body>
        </html>
    );
}
