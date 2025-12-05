'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(0.9);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Hitung opacity berdasarkan scroll (0.9 -> 0)
      // Opacity akan 0 saat scroll mencapai 1x tinggi layar
      const newOpacity = Math.max(0, 1 - (scrollY / windowHeight) * 0.9);

      setScrollOpacity(newOpacity);

      console.log('Scroll:', scrollY, 'Opacity:', newOpacity.toFixed(2));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-hidden" data-scroll-behavior="smooth">
      {/* Fixed Background Image */}
      <div className="fixed w-screen h-screen overflow-hidden top-0 left-0 -z-10">
        <div className="relative w-full h-full">
          <Image src="/winner.jpg" alt="Winner" fill className="object-cover transition-opacity duration-100" style={{ opacity: scrollOpacity }} priority />
          {/* Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" style={{ opacity: scrollOpacity }} />
        </div>
      </div>

      {/* Hero Overlay - Modern Design */}
      <div className="w-screen h-screen flex flex-col items-center max-md:justify-center justify-center-safe gap-12 px-6 py-32 relative" style={{ transform: `translateY(${-scrollOpacity * 5}px)` }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kuning/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Main Content Container */}
        <div className="relative flex flex-col py-10 items-center gap-10 max-w-5xl">
          {/* Title with glassmorphism */}
          <div className="relative group">
            <h1 className="text-7xl max-md:text-5xl font-black text-center tracking-tight">
              <span className="bg-gradient-to-r from-biruGelap via-blue-800 to-biruGelap bg-clip-text text-transparent drop-shadow-2xl">GAMAFORCE</span>
              <br />
              <span className="bg-gradient-to-r from-kuning via-yellow-400 to-kuning bg-clip-text text-transparent drop-shadow-2xl">FLIGHT REPORT</span>
            </h1>
            {/* Subtle underline decoration */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-kuning to-transparent rounded-full" />
          </div>

          {/* Subtitle with glassmorphism card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-8 py-4 shadow-2xl">
            <p className="text-white/90 text-lg max-md:text-base font-medium text-center tracking-wide">Track Your Journey to Victory</p>
          </div>
        </div>

        {/* CTA Button - Modern floating design */}
        <Link
          href="#start"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#start')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className="relative z-10 group mt-8"
          style={{ transform: `translateY(${-scrollOpacity * 100}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-kuning to-yellow-400 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <button className="relative px-12 py-5 bg-gradient-to-r from-kuning to-yellow-400 text-biruGelap font-bold text-lg rounded-2xl shadow-2xl border border-yellow-300/30 hover:scale-105 hover:shadow-kuning/50 transition-all duration-300 flex items-center gap-3">
            <span>New Flight</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </Link>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ opacity: scrollOpacity }}>
          <span className="text-white/60 text-sm font-medium">Scroll to explore</span>
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Content Sections */}

      <div id="start" className="relative h-screen scroll-smooth overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-kuning to-yellow-500">
          {/* Floating animated circles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-biruGelap/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-biruGelap/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative h-full rounded-t-4xl">
          <div className="container mx-auto px-8 pt-36 h-full flex flex-col justify-center">
            {/* Logo with fade in animation */}
            <div className="flex justify-center mb-16 animate-in fade-in slide-in-from-top duration-700">
              <Image src="/jagat saksana dirga.svg" alt="jagat saksana dirga Logo" width={800} height={75} className="max-md:w-96 max-md:h-auto drop-shadow-2xl" />
            </div>

            {/* Main Cards Container */}
            <div className="flex flex-row max-md:flex-col gap-8 justify-center items-stretch max-w-6xl mx-auto w-full">
              {/* New Flight Report Card */}
              <div className="flex-1 group animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '0.2s' }}>
                <div className="relative h-full backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/25 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-biruGelap/0 to-biruGelap/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Icon */}
                  <div className="relative flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-biruGelap to-biruGelap/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-kuning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="relative text-biruGelap text-3xl font-bold mb-6 text-center">New Flight Report</h2>

                  {/* Description */}
                  <p className="relative text-biruGelap/70 text-center mb-8 text-sm leading-relaxed">Create and submit your flight reports with detailed information</p>

                  {/* Button */}
                  <Link href="#">
                    <button className="relative w-full px-6 py-4 bg-gradient-to-r from-biruGelap to-biruGelap/90 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group/btn">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Get Started
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-kuning/20 to-kuning/40 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center max-md:hidden animate-in fade-in duration-700" style={{ animationDelay: '0.4s' }}>
                <div className="relative h-full w-px">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-biruGelap/30 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-biruGelap/40 animate-pulse"></div>
                </div>
              </div>

              {/* Mobile Divider */}
              <div className="flex items-center justify-center md:hidden animate-in fade-in duration-700" style={{ animationDelay: '0.4s' }}>
                <div className="relative w-full h-px">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-biruGelap/30 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-biruGelap/40 animate-pulse"></div>
                </div>
              </div>

              {/* Flight History Card */}
              <div className="flex-1 group animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '0.6s' }}>
                <div className="relative h-full backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/25 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-biruGelap/0 to-biruGelap/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Icon */}
                  <div className="relative flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-biruGelap to-biruGelap/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-kuning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="relative text-biruGelap text-3xl font-bold mb-6 text-center">Flight History</h2>

                  {/* Description */}
                  <p className="relative text-biruGelap/70 text-center mb-8 text-sm leading-relaxed">View and manage all your previous flight reports and records</p>

                  {/* Button */}
                  <Link href="#">
                    <button className="relative w-full px-6 py-4 bg-gradient-to-r from-biruGelap to-biruGelap/90 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group/btn">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View History
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-kuning/20 to-kuning/40 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating indicators */}
            <div className="flex justify-center gap-2 mt-12 animate-in fade-in duration-700" style={{ animationDelay: '0.8s' }}>
              <div className="w-2 h-2 rounded-full bg-biruGelap/40 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-biruGelap/40 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 rounded-full bg-biruGelap/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
