import { Link } from 'react-router-dom';

export default function StyleGuidePage() {
  return (
    <section className="panel active">
      <div className="dashboard">
        <div className="topbar">
          <div>
            <h2>Figma Style Guide</h2>
            <p>Dokumentasi visual sederhana untuk UI Sistem Administrasi KJPP.</p>
          </div>
          <Link to="/" className="secondary">
            Kembali ke Login
          </Link>
        </div>

        <div id="dashboard-content">
          <div className="card-panel">
            <h3>Tipografi</h3>
            <p>Gunakan font system yang bersih dan modern untuk tampilan profesional.</p>
            <div className="typography-samples">
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>H1 - Judul Utama</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>H2 - Subjudul</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Body - Teks utama</p>
              <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>Caption - Teks pendukung</p>
            </div>
          </div>

          <div className="card-panel">
            <h3>Warna</h3>
            <div className="color-grid">
              <div>
                <div className="color-swatch primary" />
                <p>#4f46e5</p>
                <p>Primary</p>
              </div>
              <div>
                <div className="color-swatch surface" />
                <p>#ffffff</p>
                <p>Surface</p>
              </div>
              <div>
                <div className="color-swatch neutral" />
                <p>#d1d5db</p>
                <p>Neutral</p>
              </div>
              <div>
                <div className="color-swatch accent" />
                <p>#eef2ff</p>
                <p>Accent</p>
              </div>
            </div>
          </div>

          <div className="card-panel">
            <h3>Komponen</h3>
            <p>Gunakan elemen standar berikut untuk konsistensi.</p>
            <div className="component-samples">
              <button>Primary Button</button>
              <button className="secondary">Secondary Button</button>
              <input placeholder="Input field" />
              <select>
                <option>Dropdown</option>
              </select>
            </div>
          </div>

          <div className="card-panel">
            <h3>Layout</h3>
            <ul>
              <li>Gunakan panel dan kartu dengan border-radius 18px.</li>
              <li>Spasi antar elemen minimal 20px.</li>
              <li>Gunakan topbar untuk judul halaman dan tindakan utama.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
