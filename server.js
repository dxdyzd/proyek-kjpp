import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// ============================================================================
// CONFIGURATION
// ============================================================================
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const JWT_ACCESS_EXPIRY = '60s';
const JWT_REFRESH_EXPIRY = '7d';
const VITE_DEV_URL = 'http://localhost:5173';

// Middleware setup
app.use(cors({ origin: VITE_DEV_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ============================================================================
// DATABASE (In-memory demo)
// ============================================================================
const users = {
  adminoffice: {
    password: 'office123',
    role: 'admin-office',
    name: 'Admin Office',
  },
  admintkn: {
    password: 'teknik123',
    role: 'admin-teknik',
    name: 'Admin Teknik',
  },
  owner: {
    password: 'owner123',
    role: 'owner',
    name: 'Owner',
  },
};

let refreshTokens = new Map();

// ============================================================================
// JWT HELPERS
// ============================================================================
function createAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
}

// ============================================================================
// MIDDLEWARE
// ============================================================================
function verifyAccess(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = data;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ============================================================================
// ROUTES: Authentication
// ============================================================================
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: 'Username, password, dan role harus diisi.' });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const user = users[normalizedUsername];

  if (!user || user.password !== password || user.role !== role) {
    return res
      .status(401)
      .json({
        message: 'Nama pengguna, kata sandi, atau role tidak cocok.',
      });
  }

  const payload = {
    username: normalizedUsername,
    role: user.role,
    name: user.name,
  };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  refreshTokens.set(refreshToken, payload.username);

  res.cookie('kjpp_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
  });

  return res.json({ user: payload, accessToken });
});

app.post('/api/refresh', (req, res) => {
  const refreshToken = req.cookies && req.cookies.kjpp_refresh;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token diperlukan.' });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token tidak valid.' });
  }

  try {
    const data = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const payload = {
      username: data.username,
      role: data.role,
      name: data.name,
    };
    const accessToken = createAccessToken(payload);
    return res.json({ accessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Refresh token invalid atau expired.' });
  }
});


// ============================================================================
// ROUTES: Protected Data
// ============================================================================
app.get('/api/dashboard', verifyAccess, (req, res) => {
  const role = req.user.role;

  if (role === 'admin-office') {
    return res.json({
      items: [
        { id: 1, title: 'Verifikasi surat masuk', due: 'Hari ini' },
        { id: 2, title: 'Update tracking klien', due: 'Besok' },
      ],
    });
  }

  if (role === 'admin-teknik') {
    return res.json({
      items: [
        { id: 1, site: 'Lokasi A', date: '2026-06-05' },
        { id: 2, site: 'Lokasi B', date: '2026-06-08' },
      ],
    });
  }

  if (role === 'owner') {
    return res.json({
      items: [
        { id: 1, item: 'Approve Laporan A', status: 'Pending' },
        { id: 2, item: 'Tanda tangan Dokumen B', status: 'Waiting' },
      ],
    });
  }

  return res.json({ items: [] });
});

app.post('/api/change-password', verifyAccess, (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Password harus minimal 8 karakter.' });
  }

  const username = req.user.username;
  if (users[username]) {
    users[username].password = password;
  }

  return res.json({ message: 'Password berhasil diperbarui.' });
});

// ============================================================================
// ROUTES: Health Check
// ============================================================================
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================================================
// SERVER START
// ============================================================================
app.listen(PORT, () => {
  console.log(`🚀 Backend autentikasi berjalan di http://localhost:${PORT}`);
});
