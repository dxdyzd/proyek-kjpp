import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminOfficeDashboard() {
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
    return items.filter((i) => (i.title || '').toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <section className="panel active">
      <div className="dashboard">
        <div className="topbar">
          <div>
            <span className="welcome-text">Halo, {user.name}</span>
            <span className="role-text">Role: Admin Office</span>
          </div>
          <div className="topbar-actions">
            <a className="secondary" href="/style-guide">
              Style Guide
            </a>
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
            <h3>Panel Tugas Admin Office</h3>
            <p>Ringkasan tugas administratif dan status.</p>
            <div style={{ marginBottom: 8 }}>
              <input placeholder="Filter tugas..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <ul>
              {visible.map((t) => (
                <li key={t.id}>
                  <strong>{t.title}</strong> — <em>{t.due}</em>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-panel" id="spreadsheet-embed">
            <h3>Spreadsheet Office</h3>
            <iframe
              title="Spreadsheet Office"
              src="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
