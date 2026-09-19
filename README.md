# Portal Ekstrakurikuler SMK Taruna Bangsa

Portal web kegiatan ekstrakurikuler untuk SMK Taruna Bangsa, Bekasi. Situs statis (HTML/CSS/JavaScript) tanpa backend — seluruh data dikelola lewat `localStorage` di browser. Situs dalam Bahasa Indonesia dengan dua sisi pengguna: **Siswa** dan **Admin**.

**Moto:** *Disiplin | Terampil | Berakhlak Mulia*
**Tagline:** *TARUNA BANGSA — BERPRESTASI • BERKARAKTER • BERINOVASI*
**© 2026 SMK Taruna Bangsa. Semua hak dilindungi.**

---

## Daftar Isi

- [Struktur File](#struktur-file)
- [Halaman (Pages)](#halaman-pages)
- [Akses & Akun Demo](#akses--akun-demo)
- [Fitur](#fitur)
- [Daftar Ekstrakurikuler](#daftar-ekstrakurikuler)
- [Jadwal Latihan](#jadwal-latihan)
- [Pembina](#pembina)
- [Prestasi](#prestasi)
- [Penyimpanan Data (localStorage)](#penyimpanan-data-localstorage)
- [Navigasi & Menus](#navigasi--menus)
- [Aset Visual](#aset-visual)
- [Stack Teknologi](#stack-teknologi)
- [Catatan Pengembangan](#catatan-pengembangan)

---

## Struktur File

| File | Deskripsi |
| --- | --- |
| `index.html` | Beranda / Landing page (hero, marquee, portal siswa, CTA) |
| `dashboard.html` | Dashboard siswa (statistik, notifikasi, aktivitas, pilihan ekskul) |
| `admin-dashboard.html` | Dashboard admin (kelola ekskul, status pendaftar, statistik) |
| `admin-login.html` | Halaman login admin |
| `student-login.html` | Halaman login siswa |
| `student-register.html` | Halaman pendaftaran siswa baru |
| `ekskul-detail.html` | Detail ekskul (dinamis via query `?name=`) |
| `pembina.html` | Daftar pembina/mentor |
| `prestasi.html` | Daftar prestasi |
| `jadwal.html` | Jadwal latihan mingguan (tabel) |
| `informasi.html` | Pusat informasi & kontak (peta Google Maps) |
| `dokumentasikegiatan.html` | **Kosong** — belum diimplementasikan (0 baris) |
| `privacy.html` | Halaman kebijakan privasi |
| `terms.html` | Halaman syarat & ketentuan |
| `script.js` | JavaScript utama (navigasi, sesi login, animasi, CRUD localStorage) |
| `styles.css` | Stylesheet utama (3.906 baris) |
| `jadwal.css` | Stylesheet khusus halaman jadwal (tabel & mobile drawer) |
| `logo_landing_page.png` | Logo untuk landing page |
| `logo-register.jpg` | Logo halaman pendaftaran |
| `logo-saya.png` | Logo header/beranda |
| `logo-taruna-bangsa.svg` | Logo sekolah (login & sidebar) |

---

## Halaman (Pages)

### 1. Beranda (`index.html`)
- **Top strip:** telepon `0857 7359 7604` + link sosial media.
- **Hero:** judul *"Kembangkan Bakatmu, Ciptakan Prestasimu"*, tombol **Gabung Ekskul** → `student-register.html` dan **Lihat Prestasi** → `prestasi.html`.
- **Marquee banner** berjalan dengan slogan sekolah.
- **Closing CTA:** *"MULAI PERJALANANMU"* — tombol **Daftar Sekarang** + link **Tanya Admin** (WhatsApp `wa.me/6285773597604`).
- **Portal Siswa** (`#student-portal`, tersembunyi): menampilkan Nama, NIS, Kelas bila pengguna sudah login.
- **WhatsApp float** melayang di kanan bawah.

### 2. Dashboard Siswa (`dashboard.html`)
Menu sidebar: Overview | Ekskul | Jadwal | Prestasi | Pembina.
- Kartu sambutan dengan nama siswa.
- Badge fitur ("3 notifikasi baru", "Kehadiran minggu ini 92%", ...).
- Statistik: Kelas, NIS, Ekskul Favorit.
- Panel **Aktivitas Terbaru**, **Progress Aktivitas** (profil 85%, kehadiran 92%), **Quick Actions**, **Notifikasi**.
- **Profil Siswa**: Nama, Email, Kelas, Status Pendaftar.
- **Ekskul Pilihan**: grid kartu ekskul + pencarian.
- Notifikasi dropdown dengan badge jumlah belum dibaca + *toast*.

### 3. Dashboard Admin (`admin-dashboard.html`)
Menu sidebar: Overview | Aktivitas | Beranda.
- Statistik: Siswa Terdaftar, Ekskul Aktif, Prestasi.
- Kinerja: Partisipasi siswa 86%, Pelaksanaan ekskul 92%, Prestasi 78%.
- **Kelola Ekskul** (CRUD): tambah ekskul (nama + deskripsi), cari, hapus.
- **Status Pendaftar**: daftar siswa dari `localStorage['students']` beserta statusnya.
- Notifikasi admin + toast. **Wajib login admin** — jika tidak ada sesi, diarahkan ke `admin-login.html`.

### 4. Login Admin (`admin-login.html`)
- Kredensial hardcoded: `admin` / `admin123`.
- Field username + password dengan floating label dan opsi tampilkan password.
- Validasi inline; sesi disimpan di `sessionStorage['loggedInAdmin']`.

### 5. Login Siswa (`student-login.html`)
- Login pakai **NIS + Password**.
- Demo siswa dengan NIS `12345`, password `password` (XII RPL 1).
- Opsi **Ingat saya** (→ `localStorage`) atau sesi saja (→ `sessionStorage`).
- Menampilkan error box jika NIS/password salah.

### 6. Pendaftaran Siswa (`student-register.html`)
- Field: Nama Lengkap, NIS, Kelas (12 kelas AKL & RPL dari X sampai XII), Email, Password.
- Pilihan kelas: `X AKL 1`, `X AKL 2`, `XI AKL 1`, `XI AKL 2`, `XII AKL 1`, `XII AKL 2`, `X RPL 1`, `X RPL 2`, `XI RPL 1`, `XI RPL 2`, `XII RPL 1`, `XII RPL 2`.
- Validasi: wajib semua field, wajib setujui syarat, cek NIS duplikat.
- Data disimpan ke `localStorage['students']`, langsung login & diarahkan ke `dashboard.html`.

### 7. Detail Ekskul (`ekskul-detail.html`)
- Dinamis: membaca parameter `?name=` (misal `ekskul-detail.html?name=Futsal`).
- Menampilkan ikon, nama, deskripsi, jadwal, lokasi, dan pembina.
- Menggabungkan data dari `localStorage['ex_ekskul']` dengan data default.

### 8. Pembina (`pembina.html`)
Grid 8 kartu pembina beserta ekskul yang dibimbing dan hari latihan.

### 9. Prestasi (`prestasi.html`)
3 kartu prestasi (Pencak Silat Kemenpora 2022, Paskibra 2024, Futsal 2024) dengan tingkat dan tahun.

### 10. Jadwal (`jadwal.html`)
Tabel jadwal mingguan: Hari | Ekstrakurikuler | Waktu Latihan | Lokasi.

### 11. Informasi (`informasi.html`)
- Peta Google Maps (`iframe` embed lokasi SMK Taruna Bangsa Kota Bekasi).
- Kontak: Alamat (Jl. Lingkar Utara Kalibaru Tengah, Bekasi Utara), Telepon (021) 5550 2741, WhatsApp 0812 3456 7890, Email info@ekskul-tarunabangsa.sch.id.

### 12. Halaman Legal
- `privacy.html`: pengumpulan/penggunaan/perlindungan data. Terakhir diperbarui 11 September 2026.
- `terms.html`: syarat penggunaan portal. Terakhir diperbarui 11 September 2026.

---

## Akses & Akun Demo

| Peran | Halaman | Kredensial |
| --- | --- | --- |
| Admin | `admin-login.html` | Username: `admin` • Password: `admin123` |
| Siswa | `student-login.html` | NIS: `12345` • Password: `password` |

File mungkin memiliki file `dokumentasikegiatan.html` yang kosong dan tidak berfungsi. Link dokumentasi di `index.html` menuju `dokumentasi.html?type=Foto` / `?type=Video` yang sebenarnya **belum ada** di folder (mengarah ke file yang tidak lengkap).

---

## Fitur

- **Sistem login/register** siswa & admin berbasis `localStorage`/`sessionStorage`.
- **Dashboard** terpisah untuk siswa dan admin.
- **CRUD ekskul** oleh admin (tambah, cari, hapus) + counter statistik.
- **Notifikasi & toast** real-time.
- **Pencarian ekskul** (siswa & admin).
- **Responsif & mobile**: panel slide-out hijau di kiri, hamburger menu.
- **Animasi**: blobs hero, parallax scroll, fade-up (IntersectionObserver), reveal-card, marquee, glassmorphism.
- **Aksesibilitas**: `aria-label`, `prefers-reduced-motion` dihormati.
- **Anti-XSS**: fungsi `escapeHtml()` untuk data yang dirender dari input pengguna.

---

## Daftar Ekstrakurikuler

| Ekskul | Ikon | Hari | Waktu (WIB) | Pembina |
| --- | --- | --- | --- | --- |
| Futsal | ⚽ | Senin | 15:30 - 17:30 | Budi Santoso |
| Basket | 🏀 | Selasa | 16:00 - 18:00 | Andi Rahman |
| Volley | 🏐 | Rabu | 15:45 - 17:45 | Siti Nurhaliza |
| Paskibra | 🎖️ | Kamis | 14:30 - 16:00 | Rina Marlina |
| Pencak Silat | 🥋 | Jumat | 16:15 - 18:15 | Dika Pratama |
| Musik | 🎵 | Sabtu | 08:00 - 10:00 | Nadya Aulia |
| Esport Nasa | 🎮 | Sabtu | 13:30 - 15:30 | Fajar Aditia |
| Polsis | 🛡️ | Jumat | 17:00 - 18:30 | Raka Firmansyah |

Semua latihan bertempat di **SMK Taruna Bangsa**.

---

## Jadwal Latihan

| Hari | Ekskul | Waktu (WIB) | Lokasi |
| --- | --- | --- | --- |
| Senin | Futsal | 15:30 - 17:30 | SMK Taruna Bangsa |
| Selasa | Basket | 16:00 - 18:00 | SMK Taruna Bangsa |
| Rabu | Volley | 15:45 - 17:45 | SMK Taruna Bangsa |
| Kamis | Paskibra | 14:30 - 16:00 | SMK Taruna Bangsa |
| Jumat | Pencak Silat | 16:15 - 18:15 | SMK Taruna Bangsa |
| Sabtu | Musik | 08:00 - 10:00 | SMK Taruna Bangsa |
| Sabtu | Esport Nasa | 13:30 - 15:30 | SMK Taruna Bangsa |
| Jumat | Polsis | 17:00 - 18:30 | SMK Taruna Bangsa |

---

## Pembina

| Pembina | Bidang | Hari |
| --- | --- | --- |
| Budi Santoso | Futsal | Senin |
| Andi Rahman | Basket | Selasa |
| Siti Nurhaliza | Volley | Rabu |
| Rina Marlina | Paskibra | Kamis |
| Dika Pratama | Pencak Silat | Jumat |
| Nadya Aulia | Musik | Sabtu |
| Fajar Aditia | Esport Nasa | Sabtu |
| Raka Firmansyah | Polsis | Jumat |

---

## Prestasi

1. **Kejuaraan Pencak Silat Nasional** antar pelajar Piala Kemenpora RI (GOR Cijantung) — **2022**
   - 🥇 Emas kelas C: M. Rafli Susanto (12 TAV 1)
   - 🥇 Emas kelas A: Khoirul Fiqri (10 TKR 1)
   - 🥈 Perak kelas D putri: Fitriani (12 TAV 2)
2. **Juara 1 Lomba Paskibra** tingkat Kota — **2024**
3. **Juara 1 Kejuaraan Futsal** tingkat Sekolah/Kota — **2024**

---

## Penyimpanan Data (localStorage)

| Key | Isi |
| --- | --- |
| `students` | Array data siswa `{ nis, name, kelas, email, password, statusPendaftar }` |
| `loggedInStudent` | Sesi siswa aktif (session/local sesuai pilihan) |
| `loggedInAdmin` | Sesi admin aktif (`sessionStorage`) |
| `student_notifications` | Notifikasi siswa |
| `admin_notifications` | Notifikasi admin |
| `ex_ekskul` | Array ekskul `{ name, desc }` (juga dipakai index/dashboard/detail) |
| `ex_pembina` | Data pembina `{ name, ekskul, jadwal, bio }` |
| `ex_prestasi` | Data prestasi `{ title, year, desc }` |
| `ex_jadwal` | Data jadwal `{ hari, ekskul, waktu, lokasi }` |

> Semua data bersifat lokal per-browser dan dapat di-reset oleh admin (fungsi `reset-data`).

---

## Navigasi & Menus

Menu utama (beranda & halaman lain):
`Home` → `Daftar Ekskul` (dropdown: 8 ekskul) → `Pembina` → `Prestasi` → `Jadwal` → `Informasi` → `Dokumentasi` (Foto/Video).

Menu mobile panel kiri: Home, Daftar Ekskul (dropdown), Pembina, Prestasi, Jadwal, Informasi.

---

## Aset Visual

| Aset | Lokasi Pemakaian |
| --- | --- |
| `logo-saya.png` | Logo header semua halaman beranda/landing |
| `logo_landing_page.png` | Gambar hero + background beranda |
| `logo-register.jpg` | Halaman pendaftaran siswa |
| `logo-taruna-bangsa.svg` | Login siswa & sidebar dashboard |

Font utama: **Plus Jakarta Sans** (Google Fonts).

---

## Stack Teknologi

- **HTML5** — struktur halaman.
- **CSS3** — `styles.css` (global) + `jadwal.css` (halaman jadwal); variabel CSS, grid, glassmorphism, animasi keyframes, media queries.
- **Vanilla JavaScript** (`script.js` + inline `<script>` per halaman) — interaksi, sesi, CRUD localStorage, observasi IntersectionObserver.
- **Google Fonts** & **Google Maps embed** — sumber eksternal.
- **Tanpa framework / backend** — murni front-end.

---

## Catatan Pengembangan

- `dokumentasikegiatan.html` masih kosong dan link dokumentasi di `index.html` mengarah ke `dokumentasi.html` yang **belum tersedia** — perlu dibuat.
- Kredensial admin (`admin`/`admin123`) masih hardcoded di JavaScript — sebaiknya dipindah ke backend/auth untuk produksi.
- Beranda referensi beberapa pemilih CSS lama (mis. `.ekskul-grid`, `.parent-section`) yang tidak dipakai di file HTML saat ini — kandidat pembersihan.
- Pastikan menjalankan secara **lokal (file://)** — tidak diperlukan build step atau server khusus (kecuali efek browser pada localStorage saat dibuka via `file://` di beberapa browser).