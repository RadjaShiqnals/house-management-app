# House Management Application

Aplikasi sistem manajemen iuran kebersihan dan satpam perumahan RT. Proyek ini dibangun untuk memenuhi kriteria tes teknis Fullstack Developer.

## Tech Stack

- **Backend:** Laravel 11 (PHP 8.2+) + MySQL
- **Frontend:** React 18 + Vite + Tailwind CSS v4 + React Router v7
- **Authentication:** Laravel Sanctum (Token-based SPA Authentication)

## Fitur Utama (Sesuai Requirement)
1. **Manajemen Rumah:** Pencatatan rumah (dihuni/tidak dihuni), history penghuni, dan integrasi penugasan penghuni ke rumah.
2. **Manajemen Penghuni:** CRUD data warga dengan status (tetap/kontrak), upload foto KTP, dan integrasi ke tagihan.
3. **Transaksi Iuran:** Generate tagihan bulanan otomatis (Satpam & Kebersihan), pembayaran parsial/lunas, history pembayaran.
4. **Manajemen Pengeluaran:** Pencatatan pengeluaran RT (perbaikan jalan, gaji satpam, listrik, dll).
5. **Laporan Keuangan:** Rekapitulasi per bulan (Pemasukan vs Pengeluaran) beserta saldo akhir per tahun yang bisa difilter.

---

## Instalasi & Setup

### 1. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Konfigurasi database di .env (contoh menggunakan MySQL)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=house_management
# DB_USERNAME=root
# DB_PASSWORD=

php artisan migrate
php artisan db:seed # Otomatis populate User Admin, Tipe Iuran, & 20 Rumah
php artisan storage:link

php artisan serve
```

### 2. Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Aplikasi frontend dapat diakses melalui: `http://localhost:5173`

**Kredensial Default Admin:**
- **Email:** `admin@rt.com`
- **Password:** `password`

---

## 📊 Database Schema (ERD)
Bisa divisualisasikan melalui [dbdiagram.io](https://dbdiagram.io/) menggunakan kode berikut:

```dbml
Table users {
  id int [pk, increment]
  name varchar
  email varchar [unique]
  password varchar
}

Table houses {
  id int [pk, increment]
  nomor_rumah varchar [unique]
  status enum('dihuni', 'kosong')
  alamat text
}

Table residents {
  id int [pk, increment]
  nama_lengkap varchar
  foto_ktp varchar
  status_penghuni enum('tetap', 'kontrak')
  nomor_telepon varchar
  status_nikah enum('menikah', 'belum')
}

Table house_residents {
  id int [pk, increment]
  house_id int [ref: > houses.id]
  resident_id int [ref: > residents.id]
  tgl_masuk date
  tgl_keluar date [null]
}

Table fee_types {
  id int [pk, increment]
  nama varchar
  nominal decimal
}

Table payment_bills {
  id int [pk, increment]
  house_id int [ref: > houses.id]
  fee_type_id int [ref: > fee_types.id]
  bulan date
  jumlah_bulan int
  total_tagihan decimal
  status enum('belum', 'lunas')
}

Table payments {
  id int [pk, increment]
  payment_bill_id int [ref: > payment_bills.id]
  jumlah_bayar decimal
  tgl_bayar date
}

Table expenses {
  id int [pk, increment]
  kategori varchar
  judul varchar
  jumlah decimal
  tgl_pengeluaran date
}
```

## Additional notes
- *Soft Delete* telah diimplementasikan di model-model yang disyaratkan (Houses, Residents).
- *Database Transaction* (Commit/Rollback) diimplementasikan saat proses pelunasan *Payment* dan pembuatan *Bills* agar tidak ada uang yang mengambang jika terjadi kegagalan server.
