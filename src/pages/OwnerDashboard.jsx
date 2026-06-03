import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

export default function OwnerDashboard() {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    return items.filter((i) => (i.item || '').toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <>
      <section className="panel active">
        <div className="dashboard">
          <div className="topbar">
            <div>
              <span className="welcome-text">Halo, {user.name}</span>
              <span className="role-text">Role: Owner</span>
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
              <h3>Approval & Ringkasan</h3>
              <p>Item yang menunggu approval dan ringkasan metrik.</p>
              <div style={{ marginBottom: 8 }}>
                <input placeholder="Filter approval..." value={filter} onChange={(e) => setFilter(e.target.value)} />
              </div>
              <ul>
                {visible.map((a) => (
                  <li key={a.id}>
                    <strong>{a.item}</strong> — <em>{a.status}</em>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-panel" id="spreadsheet-embed">
              <h3>Spreadsheet Owner</h3>
              <iframe
                title="Spreadsheet Owner"
                src="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
              />
            </div>
          </div>
        </div>
      </section>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Change your password">
        <p>
          The password you just used was found in a data breach. Google Password Manager recommends changing your password now.
        </p>
        <div className="modal-field">
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="modal-field">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        {errorMessage && <div className="modal-error">{errorMessage}</div>}
        {statusMessage && <div className="modal-success">{statusMessage}</div>}
        <div className="modal-footer">
          <button className="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button
            className="primary"
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
            onClick={async () => {
              setErrorMessage('');
              setStatusMessage('');
              if (newPassword.length < 8) {
                setErrorMessage('Password harus minimal 8 karakter.');
                return;
              }
              if (newPassword !== confirmPassword) {
                setErrorMessage('Konfirmasi password tidak cocok.');
                return;
              }
              try {
                const response = await authFetch('/api/change-password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ password: newPassword }),
                });
                const data = await response.json();
                if (!response.ok) {
                  setErrorMessage(data.message || 'Gagal mengubah password.');
                  return;
                }
                setStatusMessage(data.message || 'Password berhasil diubah.');
                setNewPassword('');
                setConfirmPassword('');
              } catch (err) {
                setErrorMessage('Terjadi kesalahan saat menyimpan password.');
              }
            }}
          >
            Change Password
          </button>
        </div>
      </Modal>
    </>
  );
}
