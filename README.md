# Sistem Administrasi KJPP

Project demo React + Vite dengan autentikasi backend sederhana.

## Fitur

- Login role-based untuk:
  - Admin Office
  - Admin Teknik
  - Owner
- Routing React dengan `react-router-dom`
- Backend Express untuk autentikasi
- Dashboard per role
- Spreadsheet embed nyata di dalam dashboard

## Akun demo

- `adminoffice` / `office123` / `Admin Office`
- `admintkn` / `teknik123` / `Admin Teknik`
- `owner` / `owner123` / `Owner`

## Menjalankan proyek

1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Jalankan backend:
   ```bash
   npm run server
   ```
3. Buka terminal baru, lalu jalankan frontend:
   ```bash
   npm run dev
   ```
4. Buka browser ke `http://localhost:5173`

## Testing

- `npm run test-login` — uji API login otomatis
- `npm run test-ui` — uji UI end-to-end dengan Playwright

## Halaman Figma Style Guide

- Buka `http://localhost:5173/style-guide`
- Halaman ini mendokumentasikan tipografi, palet warna, komponen tombol, dan form dari UI saat ini.

## Bundel production dan deploy

Jalankan:

```bash
npm run build
```

Hasil produksi berada di folder `dist`.

Untuk preview lokal setelah build:

```bash
npm run preview
```

Jika ingin deploy statis, taruh folder `dist` di server web atau gunakan layanan seperti Vercel / Netlify / Surge.

Sebagai contoh, jika Anda ingin menggunakan server lokal sederhana:

```bash
npm install -g serve
serve -s dist
```

## Struktur

- `src/main.jsx` — entry point React
- `src/App.jsx` — routing aplikasi
- `src/context/AuthContext.jsx` — state autentikasi dan login API
- `src/pages/LoginPage.jsx` — halaman login
- `src/pages/DashboardPage.jsx` — halaman dashboard per role
- `server.js` — backend Express untuk autentikasi

## Catatan

- Backend saat ini menggunakan data login statis untuk demo.
- Untuk production, gunakan database, token JWT, dan enkripsi password.
