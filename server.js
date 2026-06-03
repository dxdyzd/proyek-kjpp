import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

const users = {
  adminoffice: { password: 'office123', role: 'admin-office', name: 'Admin Office' },
  admintkn: { password: 'teknik123', role: 'admin-teknik', name: 'Admin Teknik' },
  owner: { password: 'owner123', role: 'owner', name: 'Owner' },
};

// In-memory refresh token store for demo purposes
let refreshTokens = new Map();

function createAccessToken(payload) {
  // short lived
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '60s' });
}

function createRefreshToken(payload) {
  // longer lived
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, dan role harus diisi.' });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = users[normalizedUsername];

  if (!user || user.password !== password || user.role !== role) {
    return res.status(401).json({ message: 'Nama pengguna, kata sandi, atau role tidak cocok.' });
  }

  const payload = { username: normalizedUsername, role: user.role, name: user.name };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  // store refresh token (in-memory for demo)
  refreshTokens.set(refreshToken, payload.username);

  // set refresh token as httpOnly cookie
  res.cookie('kjpp_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
  });

  return res.json({ user: payload, accessToken });
});

app.post('/api/refresh', (req, res) => {
  const refreshToken = req.cookies && req.cookies.kjpp_refresh;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token diperlukan.' });

  if (!refreshTokens.has(refreshToken)) return res.status(403).json({ message: 'Refresh token tidak valid.' });

  try {
    const data = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const payload = { username: data.username, role: data.role, name: data.name };
    const accessToken = createAccessToken(payload);
    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token invalid atau expired.' });
  }
});

app.post('/api/logout', (req, res) => {
  const refreshToken = req.cookies && req.cookies.kjpp_refresh;
  if (refreshToken && refreshTokens.has(refreshToken)) {
    refreshTokens.delete(refreshToken);
  }
  // clear cookie
  res.clearCookie('kjpp_refresh', { path: '/api' });
  return res.json({ message: 'Logged out' });
});

function verifyAccess(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = data;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Protected demo endpoint returning role-specific dashboard items
app.get('/api/dashboard', verifyAccess, (req, res) => {
  const role = req.user.role;
  if (role === 'admin-office') {
    return res.json({ items: [
      { id: 1, title: 'Verifikasi surat masuk', due: 'Hari ini' },
      { id: 2, title: 'Update tracking klien', due: 'Besok' },
    ]});
  }
  if (role === 'admin-teknik') {
    return res.json({ items: [
      { id: 1, site: 'Lokasi A', date: '2026-06-05' },
      { id: 2, site: 'Lokasi B', date: '2026-06-08' },
    ]});
  }
  if (role === 'owner') {
    return res.json({ items: [
      { id: 1, item: 'Approve Laporan A', status: 'Pending' },
      { id: 2, item: 'Tanda tangan Dokumen B', status: 'Waiting' },
    ]});
  }
  return res.json({ items: [] });
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend autentikasi berjalan di http://localhost:${port}`);
});
