"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Loader2, Save, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { getDefaultConfig } from '@/data/defaultConfigs';
import { TeamSelector } from '@/components/TeamSelector';

type Field = { id: string; label: string; type: string; placeholder?: string; options?: string[] };
type NestedCategory = { id: string; title: string; fields: Field[] };

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // UI State for Accordions
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    generalInfo: false,
    spesifikasi: false,
    checklistDivisi: true, // open by default
    sebelumTerbang: false,
    setelahTerbang: false,
    evaluasi: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (!currentUser) {
        router.push('/Login');
      } else {
        const email = currentUser.email || '';
        if (!email.endsWith('@mail.ugm.ac.id') && !email.endsWith('@ugm.ac.id')) {
          auth.signOut();
          router.push('/Login');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchConfig = async (teamId: string) => {
    setLoadingConfig(true);
    setErrorMsg("");
    try {
      const docRef = doc(db, 'settings', `formConfig_${teamId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      } else {
        // Fallback to global formConfig
        const fallbackRef = doc(db, 'settings', 'formConfig');
        const fallbackSnap = await getDoc(fallbackRef);
        if (fallbackSnap.exists()) {
          setConfig(fallbackSnap.data());
        } else {
          setConfig(JSON.parse(JSON.stringify(getDefaultConfig(teamId))));
        }
      }
    } catch (err: any) {
      console.error("Error fetching config:", err);
      setErrorMsg("Gagal memuat konfigurasi dari database.");
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleTeamChange = (teamId: string) => {
    if (isSaving) return;
    setSelectedTeam(teamId);
    fetchConfig(teamId);
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);
    
    try {
      const docRef = doc(db, 'settings', `formConfig_${selectedTeam}`);
      await setDoc(docRef, config);
      setSuccessMsg(`Konfigurasi tim ${selectedTeam!.toUpperCase()} berhasil disimpan!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Error saving config:", err);
      setErrorMsg("Gagal menyimpan konfigurasi ke database.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedTeam && confirm("Apakah Anda yakin ingin mereset konfigurasi tim ini ke default? Semua perubahan yang belum disimpan akan hilang.")) {
      setConfig(JSON.parse(JSON.stringify(getDefaultConfig(selectedTeam))));
    }
  };

  // State Mutators for Simple Arrays (generalInfo, spesifikasi, etc)
  const updateField = (section: string, index: number, key: keyof Field, value: any) => {
    const newConfig = { ...config };
    newConfig[section][index][key] = value;
    setConfig(newConfig);
  };
  
  const removeField = (section: string, index: number) => {
    if (!confirm("Hapus field ini?")) return;
    const newConfig = { ...config };
    newConfig[section].splice(index, 1);
    setConfig(newConfig);
  };
  
  const addField = (section: string) => {
    const newConfig = { ...config };
    newConfig[section].push({ id: `new_field_${Date.now()}`, label: "New Field", type: "text" });
    setConfig(newConfig);
  };

  // State Mutators for Nested Arrays (checklistDivisi, evaluasi)
  const updateNestedCategory = (section: string, catIndex: number, key: string, value: any) => {
    const newConfig = { ...config };
    newConfig[section][catIndex][key] = value;
    setConfig(newConfig);
  };
  
  const removeNestedCategory = (section: string, catIndex: number) => {
    if (!confirm("Hapus kategori ini beserta semua fieldnya?")) return;
    const newConfig = { ...config };
    newConfig[section].splice(catIndex, 1);
    setConfig(newConfig);
  };
  
  const addNestedCategory = (section: string) => {
    const newConfig = { ...config };
    newConfig[section].push({ id: `new_cat_${Date.now()}`, title: "New Category", fields: [] });
    setConfig(newConfig);
  };

  const updateNestedField = (section: string, catIndex: number, fieldIndex: number, key: keyof Field, value: any) => {
    const newConfig = { ...config };
    newConfig[section][catIndex].fields[fieldIndex][key] = value;
    setConfig(newConfig);
  };
  
  const removeNestedField = (section: string, catIndex: number, fieldIndex: number) => {
    const newConfig = { ...config };
    newConfig[section][catIndex].fields.splice(fieldIndex, 1);
    setConfig(newConfig);
  };
  
  const addNestedField = (section: string, catIndex: number) => {
    const newConfig = { ...config };
    newConfig[section][catIndex].fields.push({ id: `new_field_${Date.now()}`, label: "New Field", type: "checkbox" });
    setConfig(newConfig);
  };

  // RENDERERS
  const renderSimpleSection = (sectionKey: string, title: string) => {
    if (!config || !config[sectionKey]) return null;
    const isOpen = openSections[sectionKey];
    
    return (
      <div className="mb-4 glass-card rounded-xl border border-biruGelap/20 overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-biruGelap/10"
        >
          <h2 className="text-lg font-bold text-biruGelap">{title} ({config[sectionKey].length} fields)</h2>
          {isOpen ? <ChevronUp className="w-5 h-5 text-biruGelap/50" /> : <ChevronDown className="w-5 h-5 text-biruGelap/50" />}
        </button>
        
        {isOpen && (
          <div className="p-4 space-y-4 overflow-x-auto">
            <div className="min-w-[500px] space-y-4">
              {config[sectionKey].map((field: Field, i: number) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-200 group">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">ID (Unique)</label>
                    <input type="text" value={field.id} onChange={(e) => updateField(sectionKey, i, 'id', e.target.value)} className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-kuning outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Label</label>
                    <input type="text" value={field.label} onChange={(e) => updateField(sectionKey, i, 'label', e.target.value)} className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-kuning outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Type</label>
                    <select value={field.type} onChange={(e) => updateField(sectionKey, i, 'type', e.target.value)} className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-kuning outline-none">
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="textarea">Textarea</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="select">Select (Dropdown)</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => removeField(sectionKey, i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5 opacity-50 hover:opacity-100 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button onClick={() => addField(sectionKey)} className="flex items-center text-sm font-semibold text-kuning hover:text-yellow-600 p-2">
              <Plus className="w-4 h-4 mr-1" /> Add Field to {title}
            </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNestedSection = (sectionKey: string, title: string) => {
    if (!config || !config[sectionKey]) return null;
    const isOpen = openSections[sectionKey];

    return (
      <div className="mb-4 glass-card rounded-xl border border-biruGelap/20 overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-biruGelap/10"
        >
          <h2 className="text-lg font-bold text-biruGelap">{title} ({config[sectionKey].length} categories)</h2>
          {isOpen ? <ChevronUp className="w-5 h-5 text-biruGelap/50" /> : <ChevronDown className="w-5 h-5 text-biruGelap/50" />}
        </button>
        
        {isOpen && (
          <div className="p-4 space-y-6 overflow-x-auto">
            <div className="min-w-[500px] space-y-6">
              {config[sectionKey].map((cat: NestedCategory, cIndex: number) => (
              <div key={cIndex} className="p-4 bg-biruGelap/5 rounded-xl border border-biruGelap/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 mr-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Category ID</label>
                      <input type="text" value={cat.id} onChange={(e) => updateNestedCategory(sectionKey, cIndex, 'id', e.target.value)} className="w-full p-2 text-sm border rounded bg-white focus:ring-1 focus:ring-kuning outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Category Title</label>
                      <input type="text" value={cat.title} onChange={(e) => updateNestedCategory(sectionKey, cIndex, 'title', e.target.value)} className="w-full p-2 text-sm border font-bold rounded bg-white focus:ring-1 focus:ring-kuning outline-none" />
                    </div>
                  </div>
                  <button onClick={() => removeNestedCategory(sectionKey, cIndex)} className="p-2 text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg mt-5 shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Nested Fields */}
                <div className="space-y-2 pl-4 border-l-2 border-kuning/50 overflow-x-auto">
                  <div className="min-w-[450px] space-y-2">
                    {cat.fields.map((field: Field, fIndex: number) => (
                      <div key={fIndex} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                        <input type="text" value={field.id} placeholder="ID" onChange={(e) => updateNestedField(sectionKey, cIndex, fIndex, 'id', e.target.value)} className="w-1/4 p-1.5 text-xs border rounded bg-slate-50 focus:ring-1 focus:ring-kuning outline-none" />
                        <input type="text" value={field.label} placeholder="Label" onChange={(e) => updateNestedField(sectionKey, cIndex, fIndex, 'label', e.target.value)} className="flex-1 p-1.5 text-xs border rounded bg-slate-50 focus:ring-1 focus:ring-kuning outline-none" />
                        <select value={field.type} onChange={(e) => updateNestedField(sectionKey, cIndex, fIndex, 'type', e.target.value)} className="w-1/4 p-1.5 text-xs border rounded bg-slate-50 focus:ring-1 focus:ring-kuning outline-none">
                          <option value="text">Text</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="textarea">Textarea</option>
                        </select>
                        <button onClick={() => removeNestedField(sectionKey, cIndex, fIndex)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addNestedField(sectionKey, cIndex)} className="flex items-center text-xs font-semibold text-kuning hover:text-yellow-600 pt-2">
                      <Plus className="w-3 h-3 mr-1" /> Add Field
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addNestedCategory(sectionKey)} className="flex items-center text-sm font-semibold text-biruGelap bg-kuning hover:bg-yellow-400 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Add Category to {title}
            </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loadingAuth || !user) {
    return <div className="min-h-screen flex items-center justify-center text-biruGelap"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  if (!selectedTeam) {
    return (
      <TeamSelector 
        onSelect={handleTeamChange} 
        title="Select Team Settings" 
        description="Choose the GAMAFORCE sub-team to edit their flight report template." 
        backHref="/"
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 relative pt-28 md:pt-32">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-biruGelap/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center text-biruGelap hover:text-biruGelap/70 mb-6 transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sticky top-20 bg-slate-50/80 backdrop-blur-md z-20 py-4 border-b border-biruGelap/10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-biruGelap">Visual Form Builder</h1>
            <p className="text-sm text-biruGelap/70">Tambahkan atau hapus checklist penerbangan dengan mudah.</p>
          </div>
          <div className="flex flex-wrap space-x-3 gap-y-3">
            <button
              onClick={() => { setSelectedTeam(null); setConfig(null); }}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-biruGelap/20 text-biruGelap bg-white hover:bg-biruGelap/5 transition-all shadow-sm"
            >
              Ganti Tim
            </button>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold border border-biruGelap/20 text-biruGelap hover:bg-biruGelap/5 transition-all bg-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || loadingConfig || !config}
              className="flex items-center px-5 py-2 rounded-xl text-sm font-bold bg-kuning hover:bg-yellow-400 text-biruGelap transition-all shadow-md disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Config
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {loadingConfig || !config ? (
          <div className="flex items-center justify-center p-20 text-biruGelap/50">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 pb-20">
            {renderSimpleSection('generalInfo', 'General Information')}
            {renderSimpleSection('spesifikasi', 'Spesifikasi')}
            {renderNestedSection('checklistDivisi', 'Checklist Divisi')}
            {renderSimpleSection('sebelumTerbang', 'Sebelum Terbang')}
            {renderSimpleSection('setelahTerbang', 'Setelah Terbang')}
            {renderNestedSection('evaluasi', 'Evaluasi')}
          </div>
        )}
      </div>
    </div>
  );
}
