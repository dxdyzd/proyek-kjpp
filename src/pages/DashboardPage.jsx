import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const dashboards = {
  'admin-office': {
    title: 'Dashboard Admin Office',
    description: 'Kelola administrasi internal, surat masuk, dan laporan umum.',
    links: [
      {
        label: 'Spreadsheet Tracking Office',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      },
      {
        label: 'Lihat spreadsheet Office tersemat',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
      },
    ],
    embed: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
  },
  'admin-teknik': {
    title: 'Dashboard Admin Teknik',
    description: 'Kelola tugas teknis, jadwal survei, dan laporan inspeksi.',
    links: [
      {
        label: 'Spreadsheet Pemantauan Teknik',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      },
      {
        label: 'Lihat spreadsheet Teknik tersemat',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
      },
    ],
    embed: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
  },
  owner: {
    title: 'Dashboard Owner',
    description: 'Ringkasan laporan, approval, dan akses dokumen prioritas.',
    links: [
      {
        label: 'Spreadsheet Ringkasan Owner',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
      },
      {
        label: 'Lihat spreadsheet Owner tersemat',
        href: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
      },
    ],
    embed: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview',
  },
};

const roleLabel = {
  'admin-office': 'Admin Office',
  'admin-teknik': 'Admin Teknik',
  owner: 'Owner',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboard = useMemo(() => {
    return user ? dashboards[user.role] : null;
  }, [user]);

  return (
    <section className="panel active">
      <div className="dashboard">
        <div className="topbar">
          <div>
            <span className="welcome-text">Halo, {user.name}</span>
            <span className="role-text">Role: {roleLabel[user.role]}</span>
          </div>
          <div className="topbar-actions">
            <button className="secondary" onClick={() => { logout(); navigate('/'); }}>
              Keluar
            </button>
          </div>
        </div>

        <div id="dashboard-content">
          <div className="card-panel">
            <h3>{dashboard.title}</h3>
            <p>{dashboard.description}</p>
            <ul>
              {dashboard.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-panel" id="spreadsheet-embed">
            <h3>Spreadsheet Tersemat</h3>
            <iframe title="Spreadsheet tersemat" src={dashboard.embed} />
          </div>
        </div>
      </div>
    </section>
  );
}
