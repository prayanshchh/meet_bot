import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github, LogIn, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (isLoggedIn && !isLoading) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, isLoading, navigate]);

    const redirectToAuth = (provider: 'google' | 'github') => {
        // Store the intended destination
        sessionStorage.setItem('redirectAfterLogin', '/dashboard');
        window.location.href = `http://127.0.0.1:8000/auth/login/${provider}`;
    };

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Don't show login form if already authenticated
    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md space-y-6 p-6 rounded-xl shadow-lg border bg-card">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-primary text-xl font-bold">
                        <User className="h-5 w-5" />
                        Sign in to MeetBot
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Choose your preferred login method
                    </p>
                </div>

                <div className="space-y-4">
                    <Button onClick={() => {redirectToAuth('google')}} className="w-full flex gap-2 items-center justify-center cursor-pointer">
                        <LogIn className="h-4 w-4" />
                        Continue with Google
                    </Button>
                    <Button onClick={()=> {redirectToAuth('github')}} variant="outline" className="w-full flex gap-2 items-center justify-center cursor-pointer">
                        <Github className="h-4 w-4" />
                        Continue with GitHub
                    </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    By signing in, you agree to our Terms and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
