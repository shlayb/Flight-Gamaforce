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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        className={`px-10 h-22 max-md:h-22 flex justify-between items-center transition-all duration-500 max-md:px-4 ${isFloating ? 'rounded-2xl' : 'rounded-b-2xl'} ${isMenuOpen ? 'rounded-b-none' : ''}`}
        style={{
          background: 'rgba(23, 53, 93, 1)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
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

          {/* Dropdown Menu dengan Smooth Animation */}
          <div className="md:hidden">
            {/* Hamburger Button dengan Animasi */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg transition-colors relative w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>

            {/* Dropdown Container dengan Smooth Animation */}
            <div className={`absolute w-full left-0 right-0 overflow-hidden transition-all duration-500 ease-out ${isMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
              <div
                className="rounded-lg p-4 backdrop-blur-xl border border-white/10 shadow-2xl"
                style={{
                  background: 'rgba(23, 45, 93, 0.95)',
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {!isLoggedIn && isNotLoginPage && (
                  <div
                    style={{
                      animation: isMenuOpen ? 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                    }}
                  >
                    <Link href="/Login">
                      <button
                        className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        style={{ background: 'rgba(255, 206, 18, 0.9)' }}
                      >
                        <span className="relative z-10">Sign In</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </Link>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="flex flex-col gap-3">
                    {/* New Flight Report Button */}
                    <div
                      style={{
                        animation: isMenuOpen ? 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both' : 'none',
                      }}
                    >
                      <button
                        className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        style={{ background: 'rgba(255, 206, 18, 0.9)' }}
                      >
                        <span className="relative z-10">New Flight Report</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </div>

                    {/* Flight History Button */}
                    <div
                      style={{
                        animation: isMenuOpen ? 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' : 'none',
                      }}
                    >
                      <button
                        className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        style={{ background: 'rgba(255, 206, 18, 0.9)' }}
                      >
                        <span className="relative z-10">Flight History</span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </div>

                    {/* Divider */}
                    <div
                      className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-1"
                      style={{
                        animation: isMenuOpen ? 'fadeIn 0.6s ease-out 0.3s both' : 'none',
                      }}
                    ></div>

                    {/* Sign Out Button */}
                    <div
                      style={{
                        animation: isMenuOpen ? 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both' : 'none',
                      }}
                    >
                        <button
                          onClick={() => {
                            import('sweetalert2').then((module) => {
                              const Swal = module.default;
                              Swal.fire({
                                title: 'Sign Out?',
                                text: 'Are you sure you want to sign out?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ef4444',
                                cancelButtonColor: '#6b7280',
                                confirmButtonText: 'Yes, sign out',
                                cancelButtonText: 'Cancel',
                              }).then((result: { isConfirmed: boolean }) => {
                                if (result.isConfirmed) {
                                  getAuth().signOut();
                                  window.location.reload();
                                }
                              });
                            });
                          }}
                          className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                          style={{ background: 'rgba(239, 68, 68, 0.9)' }}
                        >
                          <span className="relative z-10">Sign Out</span>
                          <div className="absolute inset-0 bg-black/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
