'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar, MapPin, Target, Trash2 } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { TeamSelector } from '../../components/TeamSelector';

export default function HistoryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        router.push('/Login');
      } else {
        const email = user.email || '';
        if (!email.endsWith('@mail.ugm.ac.id') && !email.endsWith('@ugm.ac.id')) {
          auth.signOut();
          router.push('/Login');
        }
      }
    }
  }, [user, loadingAuth, router]);

  useEffect(() => {
    if (!selectedTeam) return;
    setLoading(true);

    const q = query(
      collection(db, 'flight_reports'),
      where('team', '==', selectedTeam)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort data client-side by createdAt descending to avoid Firebase composite index requirement
        fetchedData.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return dateB - dateA;
        });
        
        setReports(fetchedData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedTeam]);

  const handleDelete = async (id: string, missionName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan "${missionName || 'Tanpa Nama'}"?`)) {
      try {
        await deleteDoc(doc(db, 'flight_reports', id));
      } catch (error) {
        console.error("Error deleting report: ", error);
        alert("Gagal menghapus laporan.");
      }
    }
  };

  if (loadingAuth || !user) {
    return <div className="min-h-screen flex items-center justify-center text-biruGelap"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  if (!selectedTeam) {
    return (
      <TeamSelector 
        onSelect={setSelectedTeam} 
        title="Select Team History" 
        description="Choose the GAMAFORCE sub-team to view their flight reports." 
        backHref="/"
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 relative pt-28 md:pt-32">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-biruGelap/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto pt-10 px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button onClick={() => setSelectedTeam(null)} className="inline-flex items-center text-biruGelap hover:text-biruGelap/70 transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Team Selection
          </button>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-biruGelap">Flight History - {selectedTeam.toUpperCase()}</h1>
        <p className="text-biruGelap/70 mb-8">Riwayat laporan penerbangan yang tersimpan untuk tim {selectedTeam.toUpperCase()}.</p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-biruGelap" />
          </div>
        ) : reports.length === 0 ? (
          <div className="glass p-10 rounded-2xl text-center shadow-lg">
            <p className="text-biruGelap/70">Belum ada laporan penerbangan yang tersimpan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="glass-card p-6 rounded-2xl transition-all hover:bg-white/90">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-biruGelap mb-2 flex items-center flex-wrap gap-2">
                      {report.misi || 'Misi Tidak Diketahui'}
                      {report.team && (
                        <span className="text-[10px] px-2 py-0.5 bg-biruGelap text-white font-bold rounded-md uppercase tracking-wider">{report.team}</span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-biruGelap/70">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {report.hari_tanggal || '-'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {report.tempat || '-'}
                      </div>
                      <div className="flex items-center font-medium">
                        <Target className="w-4 h-4 mr-1 text-kuning" />
                        {report.target_tercapai || '-'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Link href={`/edit/${report.id}`} className="px-5 py-2.5 bg-kuning hover:bg-yellow-400 text-biruGelap rounded-xl text-sm font-semibold transition-all shadow-md hover:scale-105 inline-block">
                      Edit Report
                    </Link>
                    <button 
                      onClick={() => handleDelete(report.id, report.misi)} 
                      className="px-3 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all shadow-md hover:scale-105 inline-flex items-center"
                      title="Hapus laporan"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
