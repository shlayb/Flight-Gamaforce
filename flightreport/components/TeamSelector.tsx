import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TEAMS = [
  { id: 'khageswara', name: 'KHAGESWARA', logo: '/teams/khageswara.png' },
  { id: 'rasayana', name: 'RASAYANA', logo: '/teams/rasayana.png' },
  { id: 'fiachra', name: 'FIACHRA', logo: '/teams/fiachra.png' },
  { id: 'vayuastra', name: 'VAYUASTRA', logo: '/teams/vayuastra.png' },
  { id: 'virachakra', name: 'VIRACHAKRA', logo: '/teams/virachakra.png' },
];

export function TeamSelector({ 
  onSelect, 
  title = "Select Your Team", 
  description = "Choose the GAMAFORCE sub-team to continue.",
  backHref = "/"
}: { 
  onSelect: (teamId: string) => void;
  title?: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <div className="min-h-screen pb-20 relative pt-28 md:pt-32">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-biruGelap/10 to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
        {backHref && (
          <Link href={backHref} className="inline-flex items-center text-biruGelap hover:text-biruGelap/70 mb-10 transition-colors font-semibold self-start">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        )}
        
        <h1 className="text-3xl font-bold mb-4 text-biruGelap">{title}</h1>
        <p className="text-biruGelap/70 mb-10 text-center max-w-lg">
          {description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {TEAMS.map((t) => (
            <div 
              key={t.id} 
              onClick={() => onSelect(t.id)}
              className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-kuning/50 transition-all border border-biruGelap/10 bg-white"
            >
              <div className="w-24 h-24 relative mb-4">
                <Image src={t.logo} alt={t.name} fill sizes="(max-width: 768px) 100px, 100px" className="object-contain" />
              </div>
              <h3 className="font-bold text-biruGelap text-sm md:text-base text-center">{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
