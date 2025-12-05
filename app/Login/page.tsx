'use client';
import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from 'next/image';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, loadingAuthState] = useAuthState(auth);
  const router = useRouter();

  // Log setiap perubahan user state
  useEffect(() => {
    console.log('=== Auth State Changed ===');
    console.log('User:', user);
    console.log('Loading Auth State:', loadingAuthState);
    if (user) {
      console.log('✅ User logged in:', {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });
    } else {
      console.log('❌ No user logged in');
    }
  }, [user, loadingAuthState]);

  // Redirect ke home jika sudah login
  useEffect(() => {
    if (user) {
      console.log('🔄 Redirecting to home page...');
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    console.log('🚀 Starting Google Sign In...');
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      console.log('📱 Opening Google popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Sign in successful!');
      console.log('User info:', {
        email: result.user.email,
        displayName: result.user.displayName,
        uid: result.user.uid,
      });
      // Redirect otomatis via useEffect di atas
    } catch (err) {
      console.error('❌ Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
      console.log('🏁 Sign in process completed');
    }
  };

  // Show loading saat cek auth state
  if (loadingAuthState) {
    console.log('⏳ Checking authentication state...');
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      {/* Fixed Background Image */}
      <div className="fixed w-screen h-screen overflow-hidden top-0 left-0 -z-10">
        <div className="relative w-full h-full">
          <Image src="/winner.jpg" alt="Winner" fill className="object-cover transition-opacity duration-100" priority />
        </div>
      </div>

      {/* Crystal glass card */}
      <div className="relative z-10 w-full max-w-md px-8 sm:px-0 mt-20">
        <div className="backdrop-blur-md max-md:py-10 bg-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute  inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-yellow-400/5 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-10 ">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-white via-kuning to-white bg-clip-text text-transparent">Login</h1>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-300/30">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full group relative overflow-hidden">
              {/* Button background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-biruGelap rounded-2xl transition-all duration-300 "></div>

              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"></div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Button content */}
              <div className="relative px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3">
                {/* Google icon */}
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                <span className="text-white font-semibold text-base sm:text-lg">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
              </div>
            </button>

            {/* Decorative elements */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-kuning/100"></div>
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
