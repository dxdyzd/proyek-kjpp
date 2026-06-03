import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminTeknikDashboard() {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    authFetch('/api/dashboard')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setItems(data.items || []);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, [authFetch]);

  const visible = useMemo(() => {
    if (!filter) return items;
    return items.filter((i) => (i.site || '').toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <section className="panel active">
      <div className="dashboard">
        <div className="topbar">
          <div>
            <span className="welcome-text">Halo, {user.name}</span>
            <span className="role-text">Role: Admin Teknik</span>
          </div>
          <div className="topbar-actions">
            <button
              className="secondary"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Keluar
            </button>
          </div>
        </div>

        <div id="dashboard-content">
          <div className="card-panel">
            <h3>Jadwal Inspeksi</h3>
            <p>Daftar survei dan inspeksi yang akan datang.</p>
            <div style={{ marginBottom: 8 }}>
              <input placeholder="Filter lokasi..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <ul>
              {visible.map((i) => (
                <li key={i.id}>
                  <strong>{i.site}</strong> — <em>{i.date}</em>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-panel" id="spreadsheet-embed">
            <h3>Spreadsheet Teknik</h3>
            <iframe
              title="Spreadsheet Teknik"
              src="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
