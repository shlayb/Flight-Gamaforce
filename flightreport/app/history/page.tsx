'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar, MapPin, Target } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loadingAuth || !user) {
    return <div className="min-h-screen flex items-center justify-center text-biruGelap"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(collection(db, 'flight_reports'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(fetchedData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen pb-20 relative pt-28 md:pt-32">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-biruGelap/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto pt-10 px-4 relative z-10">
        <Link href="/" className="inline-flex items-center text-biruGelap hover:text-biruGelap/70 mb-8 transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold mb-2 text-biruGelap">Flight History</h1>
        <p className="text-biruGelap/70 mb-8">Riwayat laporan penerbangan yang tersimpan di sistem.</p>

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
                    <h3 className="text-xl font-bold text-biruGelap mb-2">{report.misi || 'Misi Tidak Diketahui'}</h3>
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
                  <div>
                    <Link href={`/edit/${report.id}`} className="px-5 py-2.5 bg-kuning hover:bg-yellow-400 text-biruGelap rounded-xl text-sm font-semibold transition-all shadow-md hover:scale-105 inline-block">
                      Edit Report
                    </Link>
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
