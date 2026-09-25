Portal BKK & Career Center SMK Al Kaaffah Kepanjen

Portal Web Resmi Bursa Kerja Khusus (BKK) & Sistem Informasi Penyaluran PKL/Kerja SMK Al Kaaffah Kepanjen. Aplikasi ini dirancang untuk menjembatani siswa, alumni, dan mitra industri dalam mempercepat proses rekrutmen kerja serta penempatan Praktik Kerja Lapangan (PKL).
Fitur Utama
Portal Siswa & Alumni

    Job & PKL Board Interactive: Fitur pencarian lowongan kerja dan PKL real-time berdasarkan program keahlian (TKJ, TAV, TKR).

    CV Builder Automatic Generator: Fitur pembuatan Curiculum Vitae (CV) standar BKK yang instan dan siap diunduh dalam format siap cetak.

    Google OAuth Single Sign-On (SSO): Kemudahan akses masuk akun menggunakan Google Mail tanpa perlu repot pendaftaran manual.

Admin Panel & Management

    Realtime Dashboard Analytics: Ringkasan statistik jumlah mitra industri terverifikasi, lowongan aktif, slot PKL, dan total berkas pelamar.

    Mitra Industri Management: Pengelolaan database mitra perusahaan terpercaya penyedia lowongan.

    Lowongan & Pelamar Tracking: Sistem pemantauan status lamaran kerja/PKL siswa yang transparan.

UI/UX Modern & Responsive

    Design System Custom: Dibangun menggunakan kustomisasi Tailwind CSS layer, Glassmorphism visual, serta variabel warna khusus tiap Jurusan BKK.

    Fully Mobile Responsive: Pengalaman navigasi optimal di semua perangkat (Desktop, Tablet, & Smartphone).

Tech Stack & Modul

    Framework: Next.js (App Router & Turbopack enabled)

    Language: TypeScript

    Styling: Tailwind CSS & Lucide React Icons

    Backend & Database: Supabase (PostgreSQL & Row Level Security)

    Authentication: Supabase Auth (Google Provider)

    Deployment & Hosting: Vercel + Custom Subdomain (bkk.smkalkaaffah.sch.id)

Panduan Memulai (Local Development)
1. Clone Repository
Bash

git clone https://github.com/username-kamu/webapp-bkk.git
cd webapp-bkk

2. Install Dependensi
Bash

npm install

3. Konfigurasi Environment Variable (.env.local)

Buat file .env.local di direktori utama project dan isi credentials Supabase kamu:
Code snippet

NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

4. Jalankan Development Server
Bash

npm run dev

Buka browser dan akses http://localhost:4028 untuk melihat aplikasi secara lokal.

Konfigurasi OAuth & Production Deployment

Agar fungsi autentikasi Google berjalan lancar baik di localhost maupun di domain production:

    Redirect URL Supabase: Pastikan daftarkan URL callback di Supabase Auth Settings:

        http://localhost:4028/auth/callback

        [https://bkk.smkalkaaffah.sch.id/auth/callback](https://bkk.smkalkaaffah.sch.id/auth/callback)

    DNS CNAME Jagoan Hosting: Arahkan CNAME Subdomain bkk ke cname.vercel-dns.com.

Lisensi & Hak Cipta

Dikembangkan untuk SMK Al Kaaffah Kepanjen, Kab. Malang, Jawa Timur. Seluruh hak cipta dilindungi.