const khageswaraConfig = {
  "generalInfo": [
    { "id": "hari_tanggal", "label": "Hari, tanggal", "type": "date" },
    { "id": "tempat", "label": "Tempat", "type": "text" },
    { "id": "terbang_ke", "label": "Terbang ke", "type": "number" },
    { "id": "misi", "label": "Misi", "type": "text" },
    { "id": "durasi_terbang", "label": "Durasi terbang (menit:detik)", "type": "text", "placeholder": "Contoh: 1 menit 21 detik" },
    { "id": "target_tercapai", "label": "Target tercapai", "type": "select", "options": ["Tercapai", "Tidak Tercapai"] },
    { "id": "link_video", "label": "Link Video Terbang", "type": "text" }
  ],
  "spesifikasi": [
    { "id": "motor_vtol", "label": "Motor VTOL", "type": "text", "placeholder": "Contoh: T Motor AM480 900KV" },
    { "id": "motor_pusher", "label": "Motor Pusher", "type": "text", "placeholder": "Contoh: Sunny Sky X3520 720KV" },
    { "id": "propeller_pusher", "label": "Propeller pusher", "type": "text" },
    { "id": "propeller_vtol", "label": "Propeller VTOL", "type": "text" },
    { "id": "esc_pusher", "label": "ESC pusher", "type": "text" },
    { "id": "esc_vtol", "label": "ESC VTOL", "type": "text" },
    { "id": "baterai_vtol", "label": "Baterai VTOL", "type": "text" },
    { "id": "baterai_pusher", "label": "Baterai pusher", "type": "text" }
  ],
  "checklistDivisi": [
    {
      "id": "checklist_mekanis",
      "title": "Mekanis",
      "fields": [
        { "id": "cek_mekanis_1", "label": "Airframe kokoh & tidak retak", "type": "checkbox" },
        { "id": "cek_mekanis_2", "label": "Baut & mounting motor kencang", "type": "checkbox" },
        { "id": "cek_mekanis_3", "label": "Mekanisme dropping aman", "type": "checkbox" }
      ]
    },
    {
      "id": "checklist_elektronis",
      "title": "Elektronis",
      "fields": [
        { "id": "cek_elektronis_1", "label": "Kabel & konektor tidak longgar", "type": "checkbox" },
        { "id": "cek_elektronis_2", "label": "Tegangan baterai normal", "type": "checkbox" },
        { "id": "cek_elektronis_3", "label": "Power modul berfungsi baik", "type": "checkbox" }
      ]
    },
    {
      "id": "checklist_telemetri",
      "title": "Telemetri & GCS",
      "fields": [
        { "id": "cek_telemetri_1", "label": "Koneksi telemetri stabil", "type": "checkbox" },
        { "id": "cek_telemetri_2", "label": "GPS Fix & 3D Lock", "type": "checkbox" }
      ]
    },
    {
      "id": "checklist_prog",
      "title": "SoftProg & HardProg",
      "fields": [
        { "id": "cek_prog_1", "label": "Video stream masuk ke GCS", "type": "checkbox" },
        { "id": "cek_prog_2", "label": "Mode terbang terkonfigurasi benar", "type": "checkbox" },
        { "id": "cek_prog_3", "label": "Failsafe aktif", "type": "checkbox" }
      ]
    },
    {
      "id": "checklist_pilot",
      "title": "Pilot",
      "fields": [
        { "id": "cek_pilot_1", "label": "Kalibrasi kompas selesai", "type": "checkbox" },
        { "id": "cek_pilot_2", "label": "Arah angin aman", "type": "checkbox" },
        { "id": "cek_pilot_3", "label": "Remote terkalibrasi", "type": "checkbox" }
      ]
    }
  ],
  "sebelumTerbang": [
    { "id": "pre_baterai_pusher", "label": "Baterai pusher (%)", "type": "text" },
    { "id": "pre_baterai_vtol", "label": "Baterai VTOL (%)", "type": "text" },
    { "id": "pre_baterai_remot", "label": "Baterai remot (V)", "type": "text" }
  ],
  "setelahTerbang": [
    { "id": "post_baterai_pusher", "label": "Baterai pusher (%)", "type": "text" },
    { "id": "post_baterai_vtol", "label": "Baterai VTOL (%)", "type": "text" },
    { "id": "post_baterai_remot", "label": "Baterai remot (V)", "type": "text" },
    { "id": "kerusakan", "label": "Kerusakan", "type": "textarea", "placeholder": "Contoh: Shaft motor VTOL rusak, dll." }
  ],
  "evaluasi": [
    {
      "id": "mekanis",
      "title": "1. Mekanis",
      "fields": [
        { "id": "mekanis_note", "label": "Catatan Evaluasi Mekanis", "type": "textarea", "placeholder": "Contoh: Fuse tengah kurang rata..." }
      ]
    },
    {
      "id": "elektronis",
      "title": "2. Elektronis",
      "fields": [
        { "id": "elektronis_note", "label": "Catatan Evaluasi Elektronis", "type": "textarea", "placeholder": "Contoh: Raspi undervoltage..." }
      ]
    },
    {
      "id": "telemetri",
      "title": "3. Telemetri",
      "fields": [
        { "id": "telemetri_note", "label": "Catatan Evaluasi Telemetri", "type": "textarea" }
      ]
    },
    {
      "id": "softprog",
      "title": "4. Softprog",
      "fields": [
        { "id": "softprog_note", "label": "Catatan Evaluasi Softprog", "type": "textarea" }
      ]
    },
    {
      "id": "hardprog",
      "title": "5. HardProg",
      "fields": [
        { "id": "hardprog_note", "label": "Catatan Evaluasi HardProg", "type": "textarea" }
      ]
    },
    {
      "id": "vhc",
      "title": "6. VHC",
      "fields": [
        { "id": "vhc_note", "label": "Catatan Evaluasi VHC", "type": "textarea" }
      ]
    },
    {
      "id": "pilot",
      "title": "7. Pilot",
      "fields": [
        { "id": "pilot_note", "label": "Catatan Evaluasi Pilot", "type": "textarea" }
      ]
    }
  ]
};

// --- RASAYANA (Racing Drone) ---
export const rasayanaConfig = {
  ...khageswaraConfig,
  spesifikasi: [
    { id: "motor", label: "Motor", type: "text", placeholder: "Contoh: XNova 2207" },
    { id: "propeller", label: "Propeller", type: "text" },
    { id: "esc", label: "ESC", type: "text" },
    { id: "baterai", label: "Baterai", type: "text" }
  ],
  sebelumTerbang: [
    { id: "pre_baterai", label: "Baterai Drone (%)", type: "text" },
    { id: "pre_baterai_remot", label: "Baterai remot (V)", type: "text" }
  ],
  setelahTerbang: [
    { id: "post_baterai", label: "Baterai Drone (%)", type: "text" },
    { id: "post_baterai_remot", label: "Baterai remot (V)", type: "text" },
    { id: "kerusakan", label: "Kerusakan", type: "textarea" }
  ]
};

// --- FIACHRA (Fixed Wing) ---
export const fiachraConfig = {
  ...khageswaraConfig,
  spesifikasi: [
    { id: "motor_pusher", label: "Motor Utama", type: "text" },
    { id: "propeller", label: "Propeller", type: "text" },
    { id: "esc", label: "ESC", type: "text" },
    { id: "baterai", label: "Baterai Utama", type: "text" }
  ],
  sebelumTerbang: [
    { id: "pre_baterai", label: "Baterai Utama (%)", type: "text" },
    { id: "pre_baterai_remot", label: "Baterai remot (V)", type: "text" }
  ],
  setelahTerbang: [
    { id: "post_baterai", label: "Baterai Utama (%)", type: "text" },
    { id: "post_baterai_remot", label: "Baterai remot (V)", type: "text" },
    { id: "kerusakan", label: "Kerusakan", type: "textarea" }
  ]
};

// --- VAYUASTRA & VIRACHAKRA (Base copies for now) ---
export const vayuastraConfig = { ...khageswaraConfig };
export const virachakraConfig = { ...khageswaraConfig };

export const getDefaultConfig = (teamId: string) => {
  switch (teamId.toLowerCase()) {
    case 'khageswara': return khageswaraConfig;
    case 'rasayana': return rasayanaConfig;
    case 'fiachra': return fiachraConfig;
    case 'vayuastra': return vayuastraConfig;
    case 'virachakra': return virachakraConfig;
    default: return khageswaraConfig;
  }
};
