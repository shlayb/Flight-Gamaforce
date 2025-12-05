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
        </div>
      </div>

      {/* Hero Overlay */}
      <div className=" top-0 left-0 w-screen h-screen flex flex-col gap-28  p-32 my-22 items-center justify-center " style={{ transform: `translateY(${-scrollOpacity * 5}px)` }}>
        <h1 className=" text-biruGelap text-center py-10 text-6xl max-md:text-5xl font-extrabold drop-shadow-xl drop-shadow-kuning/10">GAMAFORCE FLIGHT REPORT</h1>
        <Link
          href="#start"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#start')?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
        >
          <button
            style={{ transform: `translateY(${-scrollOpacity * 100}px)` }}
            className="px-10 py-4 bg-kuning/50 backdrop-blur-md text-biruGelap font-semibold rounded-2xl border cursor-pointer border-yellow-100/50 hover:bg-kuning/60 hover:text-xl transition-all duration-300 shadow-lg"
          >
            New Flight
          </button>
        </Link>
      </div>
      {/* Content Sections */}

      <div id="start" className="relative scroll-smooth">
        <div className="h-full bg-kuning rounded-t-4xl `">
          <div className="container mx-auto px-8 pt-32">
            <div className="flex justify-center">
              <Image src="/jagat saksana dirga.svg" alt="jagat saksana dirga Logo" width={800} height={75} className=" max-md:w-40 max-md:h-auto" />
            </div>
            <div className="flex flex-row max-md:flex-col gap-12 justify-center items-center py-24 ">
              <div className="flex flex-col gap-8 justify-center items-center  ">
                <h2 className="text-black text-3xl">New Flight Report</h2>
                <Link href="#">
                  <button className="px-10 py-4 bg-biruGelap/20 backdrop-blur-md text-black font-semibold rounded-2xl border cursor-pointer border-yellow-100/20 hover:bg-biruGelap/60 hover:text-lg transition-all duration-300 shadow-lg w-72">
                    New Flight Report
                  </button>
                </Link>
              </div>
              {/* buat garis sekat */}
              <div>
                <div className="w-0.5 h-48 bg-black/20 mx-8 max-md:mx-0 max-md:w-72 max-md:h-px"></div>
              </div>
              <div className="flex flex-col gap-8 justify-center items-center  ">
                <h2 className="text-black text-3xl">Flight History</h2>
                <Link href="#">
                  <button className="px-10 py-4  bg-biruGelap/20 backdrop-blur-md text-black font-semibold rounded-2xl border cursor-pointer border-yellow-100/50 hover:bg-biruGelap/60 hover:text-xl transition-all duration-300 shadow-lg w-72">
                    Flight History
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
