'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/firebase.config';

// Initialize Firebase
initializeApp(firebaseConfig);

export default function Header() {
  const [isFloating, setIsFloating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotLoginPage, setIsNotLoginPage] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cek apakah user sudah login dengan onAuthStateChanged
  useEffect(() => {
    console.log('🔍 Checking login status...');
    setIsNotLoginPage(window.location.pathname !== '/Login');

    const auth = getAuth();

    // Subscribe ke perubahan auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('=== Auth State Changed in Header ===');
      if (user) {
        console.log('✅ User is logged in:', {
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        });
        setIsLoggedIn(true);
      } else {
        console.log('❌ User is not logged in');
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isFloating ? 'p-2' : 'p-0'}`}>
      <div
        className={`px-10 h-22 max-md:h-22 flex justify-between items-center transition-all duration-500 max-md:px-4 ${isFloating ? 'rounded-2xl' : 'rounded-b-2xl'}`}
        style={{
          background: 'rgba(23, 53, 93, 1)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isFloating ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' : '0 4px 24px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex w-full justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image src="/GAMAFORCE.svg" alt="GAMAFORCE Logo" width={200} height={75} className="max-md:w-40 max-md:h-auto" />
          </Link>

          {/* Navigation - Show Sign In button only if not logged in and not on login page */}
          {isNotLoginPage && !isLoggedIn && !authLoading ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/Login">
                <button
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(234, 179, 8, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 20px 0 rgba(234, 179, 8, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Sign In
                </button>
              </Link>
            </div>
          ) : null}

          {/* Show user info if logged in */}
          {isLoggedIn && !authLoading ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-white text-sm">Welcome, {getAuth().currentUser?.displayName || 'User'}</span>
                <button
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                  console.log('🚪 Signing out...');
                  getAuth().signOut();
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(239, 68, 68, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px 0 rgba(239, 68, 68, 0.4), inset 0 1px 0 0 rgba(239, 68, 68, 0.2)',
                }}
                >
                Sign Out
                </button>
            </div>
          ) : null}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg transition-colors" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
