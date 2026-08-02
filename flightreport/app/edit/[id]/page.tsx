'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileDown, CheckCircle2, Loader2 } from 'lucide-react';
import { getDefaultConfig } from '../../../data/defaultConfigs';
import { db, auth } from '../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PdfTemplate } from '../../../components/PdfTemplate';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function EditReport() {
  const { id } = useParams();
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  
  const [formData, setFormData] = useState<any>({});
  const [formConfig, setFormConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      router.push('/Login');
      return;
    }
    const email = user.email || '';
    if (!email.endsWith('@mail.ugm.ac.id') && !email.endsWith('@ugm.ac.id')) {
      auth.signOut();
      router.push('/Login');
      return;
    }

    const fetchData = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'flight_reports', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          
          // Fetch corresponding team config
          const team = data.team || 'khageswara';
          const configRef = doc(db, 'settings', `formConfig_${team}`);
          const configSnap = await getDoc(configRef);
          
          if (configSnap.exists()) {
            setFormConfig(configSnap.data());
          } else {
            const fallbackRef = doc(db, 'settings', 'formConfig');
            const fallbackSnap = await getDoc(fallbackRef);
            if (fallbackSnap.exists()) {
              setFormConfig(fallbackSnap.data());
            } else {
              setFormConfig(getDefaultConfig(team));
            }
          }
        } else {
          alert('Laporan tidak ditemukan!');
          router.push('/history');
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
        setLoadingConfig(false);
      }
    };

    fetchData();
  }, [user, loadingAuth, id, router]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldId]: value }));
  };

  const handleUpdateAndGenerate = async () => {
    setIsSaving(true);
    try {
      // 1. Update Firebase
      const docRef = doc(db, 'flight_reports', id as string);
      await updateDoc(docRef, formData);

      // 2. Generate PDF
      if (pdfRef.current) {
        const element = pdfRef.current;
        const originalLeft = element.style.left;
        const originalTop = element.style.top;
        const originalZIndex = element.style.zIndex;
        
        element.style.left = '0';
        element.style.top = '0';
        element.style.zIndex = '9999';
        
        const canvas = await html2canvas(element, { 
          scale: 4, 
          useCORS: true,
          logging: false 
        });
        
        element.style.left = originalLeft;
        element.style.top = originalTop;
        element.style.zIndex = originalZIndex;

        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        const margin = 20;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 2 * margin;
        const printHeight = pdfHeight - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = margin;
        let yShift = 0;

        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= printHeight;
        yShift += printHeight;

        // Tutupi margin bawah dengan kotak putih
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');

        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - yShift;
          pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
          heightLeft -= printHeight;
          yShift += printHeight;

          // Tutupi margin atas dan bawah dengan kotak putih di halaman baru
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pdfWidth, margin, 'F');
          pdf.rect(0, pdfHeight - margin, pdfWidth, margin, 'F');
        }

        // Tambahkan area link transparan di atas gambar tombol pada halaman pertama
        if (formData.link_video) {
          pdf.setPage(1);
          // Mengkalkulasi perkiraan posisi tombol di PDF (Margin 20mm + Logo & Judul ~30mm = 50mm)
          pdf.link(margin, 45, imgWidth, 15, { url: formData.link_video });
        }

        const datePart = formData.hari_tanggal ? formData.hari_tanggal.replace(/-/g, '_').replace(/\//g, '_').replace(/ /g, '_') : 'draft';
        const flightNum = formData.terbang_ke || '0';
        pdf.save(`flight_report_${datePart}_#${flightNum}.pdf`);
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Terjadi kesalahan saat mengupdate database!");
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: any) => {
    return (
      <div key={field.id} className="mb-4">
        <label className="block text-sm font-medium text-biruGelap/80 mb-1">{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea
            className="w-full bg-white border border-biruGelap/20 rounded-lg p-3 text-biruGelap focus:outline-none focus:border-kuning focus:ring-1 focus:ring-kuning transition-colors shadow-sm"
            placeholder={field.placeholder || ''}
            rows={3}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={formData[field.id] || ''}
          />
        ) : field.type === 'select' ? (
          <select
            className="w-full bg-white border border-biruGelap/20 rounded-lg p-3 text-biruGelap focus:outline-none focus:border-kuning focus:ring-1 focus:ring-kuning transition-colors shadow-sm"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={formData[field.id] || ''}
          >
            <option value="">-- Pilih --</option>
            {field.options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-biruGelap/20 text-biruGelap focus:ring-kuning bg-white"
              onChange={(e) => handleInputChange(field.id, e.target.checked ? "Ya" : "Tidak")}
              checked={formData[field.id] === "Ya"}
            />
            <span className="text-biruGelap/80">{field.label}</span>
          </label>
        ) : (
          <input
            type={field.type}
            className="w-full bg-white border border-biruGelap/20 rounded-lg p-3 text-biruGelap focus:outline-none focus:border-kuning focus:ring-1 focus:ring-kuning transition-colors shadow-sm"
            placeholder={field.placeholder || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            value={formData[field.id] || ''}
          />
        )}
      </div>
    );
  };

  if (loadingAuth || !user) {
    return <div className="min-h-screen flex items-center justify-center text-biruGelap"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  if (isLoading || loadingConfig) {
    return <div className="min-h-screen flex items-center justify-center text-biruGelap"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  return (
    <div className="min-h-screen pb-20 relative pt-28 md:pt-32">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-biruGelap/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto pt-10 px-4 relative z-10">
        <Link href="/history" className="inline-flex items-center text-biruGelap hover:text-biruGelap/70 mb-8 transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
        </Link>
        
        <h1 className="text-4xl font-bold mb-2 text-biruGelap">Edit Flight Report</h1>
        <p className="text-biruGelap/70 mb-8">Ubah dan perbarui laporan penerbangan Anda.</p>

        <div className="space-y-6">
          <section className="glass-card p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-biruGelap border-b border-biruGelap/20 pb-2">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formConfig.generalInfo.map(renderField)}
            </div>
          </section>

          <section className="glass-card p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-biruGelap border-b border-biruGelap/20 pb-2">Spesifikasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formConfig.spesifikasi.map(renderField)}
            </div>
          </section>

          <section className="glass-card p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-biruGelap border-b border-biruGelap/20 pb-2">Checklist Persiapan Divisi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formConfig.checklistDivisi.map((divisi: any) => (
                <div key={divisi.id} className="bg-white/50 p-4 rounded-xl border border-biruGelap/10 shadow-sm">
                  <h3 className="text-lg font-bold text-biruGelap mb-3">{divisi.title}</h3>
                  <div className="space-y-3">
                    {divisi.fields.map(renderField)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="glass-card p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-biruGelap border-b border-biruGelap/20 pb-2">Sebelum Terbang</h2>
              {formConfig.sebelumTerbang.map(renderField)}
            </section>

            <section className="glass-card p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-biruGelap border-b border-biruGelap/20 pb-2">Setelah Terbang</h2>
              {formConfig.setelahTerbang.map(renderField)}
            </section>
          </div>

          <section className="glass-card p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-biruGelap border-b border-biruGelap/20 pb-2">Evaluasi</h2>
            <div className="space-y-8">
              {formConfig.evaluasi.map((section: any) => (
                <div key={section.id}>
                  <h3 className="text-lg font-bold text-biruGelap mb-3">{section.title}</h3>
                  <div className="pl-4 border-l-2 border-kuning space-y-4">
                    {section.fields.map(renderField)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleUpdateAndGenerate}
              disabled={isSaving}
              className={`flex items-center px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                isSuccess ? 'bg-emerald-500 text-white' : 'bg-kuning hover:bg-yellow-400 text-biruGelap'
              }`}
            >
              {isSaving ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...</>
              ) : isSuccess ? (
                <><CheckCircle2 className="w-5 h-5 mr-2" /> Updated & Downloaded!</>
              ) : (
                <><FileDown className="w-5 h-5 mr-2" /> Update & Generate PDF</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div style={{ overflow: 'hidden', height: 0, width: 0 }}>
        <PdfTemplate ref={pdfRef} data={formData} config={formConfig} />
      </div>
    </div>
  );
}
