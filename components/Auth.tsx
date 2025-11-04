
import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Logo from './Logo';

const Auth: React.FC = () => {
    const supabase = useSupabaseClient();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redirectUrl, setRedirectUrl] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRedirectUrl(window.location.origin);
        }
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            setError(error.error_description || error.message);
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
                <Logo className="w-24 h-24 mx-auto mb-6 text-emerald-500" />
                <h1 className="text-4xl font-bold text-white mb-2">Welcome to <span className="text-emerald-500">DarTrack</span></h1>
                <p className="text-lg text-gray-400 mb-10">Your intelligent academic planner.</p>
                
                {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6">{error}</p>}

                <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-md disabled:opacity-70 disabled:cursor-wait"
                >
                    {isLoggingIn ? (
                        <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.986,36.689,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                    )}
                    <span>Sign in with Google</span>
                </button>

                {redirectUrl && (
                    <div className="mt-10 bg-gray-800 border border-gray-700 rounded-lg p-4 text-left">
                        <label className="text-xs font-semibold text-indigo-300 block mb-2">Your Supabase Redirect URL:</label>
                        <p className="text-sm text-gray-200 bg-gray-900 p-3 rounded-md font-mono break-all select-all">
                            {redirectUrl}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            Copy this exact URL and paste it into the "Redirect URLs" field in your Supabase project's Authentication settings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
