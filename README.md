# KopQuest — Frontend

KopQuest adalah aplikasi web gamifikasi yang menyasar Player dari kalangan Gen Alpha dan Gen Z untuk mendukung koperasi desa. Player menjalankan "misi" berbasis peran (mis. Affiliator, Content Creator, Duta Sebaya), mengumpulkan XP, naik level, dan membuka reward lewat sistem battle pass. Repo ini berisi frontend aplikasi — antarmuka yang dikonsumsi Player di browser/mobile.

Frontend ini adalah SPA/UI layer yang mengonsumsi REST API dari [KopQuest Backend](https://github.com/Snack-Looter) (Django REST Framework). Repo backend dan database tidak termasuk di sini.

## Arsitektur & Teknologi

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) | Routing berbasis folder di `app/`, render di sisi klien untuk sebagian besar halaman |
| Bahasa | TypeScript (strict mode) | Lihat `tsconfig.json` |
| UI | React 19 | |
| Styling | Tailwind CSS v4 | Konfigurasi tema/warna di `tailwind.config.ts`, token global di `app/globals.css` |
| Font | Geist, Geist Mono, Baloo 2, Poppins (`next/font/google`) + Material Symbols Rounded (ikon) | Diatur di `app/layout.tsx` |
| Auth | JWT (access + refresh token) disimpan di `localStorage` | Lihat `lib/auth.ts` |
| Komunikasi API | `fetch` native ke backend, lewat helper terpusat | Lihat `lib/api.ts` |
| Deployment | Docker (multi-stage, Next.js standalone output) → Google Cloud Run | Lihat `Dockerfile` dan `.github/workflows/deploy.yml` |
| CI/CD | GitHub Actions, auto-deploy saat push ke branch `development` | Autentikasi ke GCP via Workload Identity Federation (tanpa service-account key) |

Aplikasi dikunci ke lebar kolom mobile (`max-w-app`, 430px) dan dipusatkan di layar — di desktop area sekitarnya jadi backdrop, sehingga tampilan tetap konsisten seperti aplikasi HP.

### Struktur Direktori

```
frontend/
├── app/                    # Routing (App Router) — satu folder = satu halaman
│   ├── page.tsx            # Landing/login
│   ├── register/           # Alur pendaftaran multi-step
│   ├── home/                # Dashboard misi aktif
│   ├── mission/[id]/        # Detail misi
│   ├── progress/            # Progress tracker (role & riwayat misi)
│   ├── reward/               # Battle pass / reward
│   ├── account/              # Profil & pengaturan akun
│   ├── chatbot/              # Chat AI
│   └── design-system/        # Halaman referensi komponen UI
├── components/
│   ├── game/                # Komponen bertema game (MissionCard, XPCounter, LevelBadge, dll)
│   ├── signup/               # Step-step form pendaftaran
│   └── ui/                   # Komponen dasar (Card, Modal, Toast, PushButton, dll)
├── lib/
│   ├── api.ts                # Semua pemanggilan REST API ke backend
│   ├── auth.ts                # Penyimpanan token & hook status login
│   └── format.ts
└── public/                   # Aset statis (gambar mascot, ikon)
```

## Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat

- Node.js 20 atau lebih baru
- npm (atau yarn/pnpm/bun — ikuti lockfile yang tersedia, `package-lock.json`)
- Backend KopQuest sudah berjalan (default di `http://127.0.0.1:8000`) — lihat repo backend untuk setup-nya

### 1. Clone repository

```bash
git clone https://github.com/Snack-Looter/frontend.git
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment variable

Buat file `.env` di root proyek (atau salin dari contoh di bawah) untuk menunjuk ke alamat backend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

> Catatan: variabel bernama `NEXT_PUBLIC_API_URL` (bukan `_BASE_URL`) yang benar-benar dibaca oleh kode di `lib/api.ts` dan yang di-bake saat build Docker (`--build-arg NEXT_PUBLIC_API_URL`). Pastikan nama variabel di `.env` konsisten dengan yang dipakai environment kamu.

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Skrip lain yang tersedia

```bash
npm run build   # Build production
npm run start   # Jalankan hasil build (production mode)
npm run lint     # Jalankan ESLint
```

## Menjalankan dengan Docker

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 -t kopquest-frontend .
docker run -p 3000:3000 kopquest-frontend
```

## Deployment

Push ke branch `development` akan otomatis men-trigger GitHub Actions (`.github/workflows/deploy.yml`) yang melakukan build image Docker, push ke Google Artifact Registry, lalu deploy ke Google Cloud Run (region `asia-southeast2`). URL backend Cloud Run diambil otomatis sebagai `NEXT_PUBLIC_API_URL` saat build image.