import React from 'react';

// Props will receive all the state data from the form
export const PdfTemplate = React.forwardRef<HTMLDivElement, { data: any, config: any }>(({ data, config }, ref) => {
  if (!config) return null;
  return (
    <div
      ref={ref}
      style={{
        width: '170mm', // Lebar A4 (210) dikurangi margin kiri-kanan (2x20)
        minHeight: '297mm',
        padding: '0', // Padding ditangani oleh jsPDF agar margin tiap halaman konsisten
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        zIndex: -1,
      }}
    >
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Logo */}
        <div style={{ margin: '0 auto 10px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={`/teams/${data.team || 'khageswara'}.png`} 
            alt={`${(data.team || 'khageswara').toUpperCase()} Logo`} 
            style={{ height: '80px', objectFit: 'contain' }} 
            crossOrigin="anonymous"
          />
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
          FLIGHT REPORT {(data.team || 'KHAGESWARA').toUpperCase()} {new Date().getFullYear()}
        </h1>
        {data.link_video && (
          <p style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>LINK VIDEO TERBANG:</span> 
            <a href={data.link_video} style={{
              textDecoration: 'none', 
              color: '#3b82f6', 
              backgroundColor: '#f1f5f9',
              padding: '4px 12px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 'bold',
              border: '1px solid #e2e8f0'
            }}>
              🎬 TONTON VIDEO
            </a>
          </p>
        )}
      </div>

      {/* General Info */}
      <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '30%', fontWeight: 'bold' }}>Hari, tanggal</td>
            <td style={{ width: '70%' }}>: {data.hari_tanggal || '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Tempat</td>
            <td>: {data.tempat || '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Terbang ke</td>
            <td>: {data.terbang_ke || '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Misi</td>
            <td>: {data.misi || '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Durasi terbang</td>
            <td>: {data.durasi_terbang || '-'}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Target tercapai</td>
            <td style={{ fontWeight: 'bold' }}>: {data.target_tercapai || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Spesifikasi */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>SPESIFIKASI</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td style={{ width: '30%' }}>Motor VTOL</td><td>: {data.motor_vtol || '-'}</td></tr>
            <tr><td>Motor Pusher</td><td>: {data.motor_pusher || '-'}</td></tr>
            <tr><td>Propeller pusher</td><td>: {data.propeller_pusher || '-'}</td></tr>
            <tr><td>Propeller VTOL</td><td>: {data.propeller_vtol || '-'}</td></tr>
            <tr><td>ESC pusher</td><td>: {data.esc_pusher || '-'}</td></tr>
            <tr><td>ESC VTOL</td><td>: {data.esc_vtol || '-'}</td></tr>
            <tr><td>Baterai VTOL</td><td>: {data.baterai_vtol || '-'}</td></tr>
            <tr><td>Baterai pusher</td><td>: {data.baterai_pusher || '-'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Checklist Divisi */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>CHECKLIST PERSIAPAN DIVISI</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '15px' }}>
          {config.checklistDivisi.map((divisi: any, index: number) => (
            <div key={divisi.id || index} style={{ width: '45%' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>{divisi.title}</h3>
              <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
                {divisi.fields.map((field: any) => (
                  <li key={field.id}>
                    {field.label}: <strong>{data[field.id] === 'Ya' ? '✅' : '❌'}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sebelum Terbang */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>SEBELUM TERBANG</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {config.sebelumTerbang.map((field: any) => (
              <tr key={field.id}><td style={{ width: '40%' }}>{field.label}</td><td>: {data[field.id] || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Setelah Terbang */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>SETELAH TERBANG</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {config.setelahTerbang.map((field: any) => (
              <tr key={field.id}>
                <td style={{ width: '40%', verticalAlign: field.type === 'textarea' ? 'top' : 'middle' }}>
                  {field.label}
                </td>
                <td>: {data[field.id] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluasi */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '5px' }}>EVALUASI</h2>
        
        <div style={{ paddingLeft: '20px' }}>
          {config.evaluasi.map((item: any) => (
            <div key={item.id} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>{item.title}</h3>
              <ul style={{ margin: '0 0 0 20px' }}>
                {item.fields.map((field: any) => (
                  <li key={field.id}>{data[field.id] || '-'}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tanda Tangan */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ textAlign: 'center', width: '200px' }}>
          <p style={{ marginBottom: '70px' }}>Mengetahui,</p>
          <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{data.pilot || '...........................................'}</p>
          <p>Pilot</p>
        </div>
      </div>
    </div>
  );
});

PdfTemplate.displayName = 'PdfTemplate';
