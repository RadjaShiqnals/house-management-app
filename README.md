# Plan: Aplikasi Manajemen Iuran Perumahan RT

## Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 11 (PHP 8.2+) |
| Frontend | React 18 + Vite |
| Database | MySQL 8.0 |
| Auth | Laravel Sanctum (SPA token) |
| File Storage | Laravel Storage (local disk) |
| Chart | Recharts (React) |
| HTTP Client | Axios |
| CSS | Tailwind CSS v3 |

---

## ERD

```
residents (penghuni)
  id, nama_lengkap, foto_ktp (path), status_penghuni (tetap/kontrak),
  nomor_telepon, status_nikah (menikah/belum), created_at, updated_at, deleted_at

houses (rumah)
  id, nomor_rumah, alamat, status (dihuni/tidak_dihuni),
  resident_id (FK -> residents, nullable, penghuni aktif),
  created_at, updated_at, deleted_at

house_resident_history (historical penghuni per rumah)
  id, house_id (FK), resident_id (FK), tgl_masuk, tgl_keluar (nullable),
  created_at, updated_at

fee_types (jenis iuran)
  id, nama (satpam/kebersihan), nominal, created_at, updated_at
  -- seed: satpam=100000, kebersihan=15000

payment_bills (tagihan per penghuni per bulan)
  id, house_id (FK), resident_id (FK), fee_type_id (FK),
  bulan (DATE: YYYY-MM-01), jumlah_bulan (int, default 1),
  total_tagihan, status (lunas/belum), created_at, updated_at

payments (transaksi pembayaran)
  id, payment_bill_id (FK), jumlah_bayar, tgl_bayar (DATE),
  keterangan, created_at, updated_at

expenses (pengeluaran RT)
  id, kategori (perbaikan_jalan/perbaikan_selokan/gaji_satpam/token_listrik/lainnya),
  judul, jumlah, tgl_pengeluaran (DATE), keterangan, created_at, updated_at, deleted_at
```

**Relasi:**
- `houses` belongsTo `residents` (penghuni aktif)
- `houses` hasMany `house_resident_history`
- `payment_bills` belongsTo `fee_types`, `houses`, `residents`
- `payment_bills` hasMany `payments`

---

## Dependencies

### Backend (Laravel)

```
// composer.json require
laravel/framework: ^11.0
laravel/sanctum: ^4.0
intervention/image: ^3.0      // resize/validate foto KTP
spatie/laravel-query-builder: ^5.0  // filter & sort API
maatwebsite/excel: ^3.1       // export data untuk developer

// composer.json require-dev
laravel/pint: ^1.0
fakerphp/faker: ^1.23
```

> NOTE: intervention/image v3 butuh PHP extension `gd` atau `imagick`. Pastikan aktif di php.ini.

### Frontend (React + Vite)

```
// dependencies
react: ^18.3
react-dom: ^18.3
react-router-dom: ^6.23
axios: ^1.7
recharts: ^2.12              // grafik pemasukan/pengeluaran
@tanstack/react-query: ^5.40 // server state management
react-hook-form: ^7.52
zod: ^3.23                   // validasi form
@hookform/resolvers: ^3.6
date-fns: ^3.6               // format tanggal
react-hot-toast: ^2.4        // notifikasi

// devDependencies
vite: ^5.3
@vitejs/plugin-react: ^4.3
tailwindcss: ^3.4
autoprefixer: ^10.4
postcss: ^8.4
```

---

## Struktur File

### Backend (`/backend` - Laravel)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php           # login, logout, me
│   │   │   ├── ResidentController.php       # CRUD penghuni + upload KTP
│   │   │   ├── HouseController.php          # CRUD rumah
│   │   │   ├── HouseResidentController.php  # assign/unassign penghuni ke rumah
│   │   │   ├── FeeTypeController.php        # CRUD jenis iuran
│   │   │   ├── PaymentBillController.php    # generate & list tagihan
│   │   │   ├── PaymentController.php        # proses bayar (DB transaction)
│   │   │   ├── ExpenseController.php        # CRUD pengeluaran RT
│   │   │   ├── ReportController.php         # summary + grafik per tahun
│   │   │   └── DeveloperExportController.php # export data (termasuk soft deletes)
│   │   └── Requests/
│   │       ├── StoreResidentRequest.php
│   │       ├── UpdateResidentRequest.php
│   │       ├── StoreHouseRequest.php
│   │       ├── StorePaymentBillRequest.php
│   │       ├── StorePaymentRequest.php
│   │       └── StoreExpenseRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Resident.php              # use SoftDeletes
│   │   ├── House.php                 # use SoftDeletes
│   │   ├── HouseResidentHistory.php
│   │   ├── FeeType.php
│   │   ├── PaymentBill.php
│   │   ├── Payment.php
│   │   └── Expense.php               # use SoftDeletes
│   └── Services/
│       ├── PaymentService.php        # logic bayar + DB::transaction
│       └── BillGeneratorService.php  # auto-generate tagihan bulanan
├── database/
│   ├── migrations/
│   │   ├── xxxx_create_residents_table.php
│   │   ├── xxxx_create_houses_table.php
│   │   ├── xxxx_create_house_resident_history_table.php
│   │   ├── xxxx_create_fee_types_table.php
│   │   ├── xxxx_create_payment_bills_table.php
│   │   ├── xxxx_create_payments_table.php
│   │   └── xxxx_create_expenses_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php       # admin RT default
│       ├── FeeTypeSeeder.php    # satpam 100k, kebersihan 15k
│       └── HouseSeeder.php      # 20 rumah awal
├── routes/
│   └── api.php                  # semua route prefix /api/v1
├── storage/app/public/ktp/      # foto KTP
├── .env.example
└── README.md
```

### Frontend (`/frontend` - React + Vite)

```
frontend/
├── src/
│   ├── api/
│   │   ├── axiosInstance.js         # base URL, interceptor token
│   │   ├── auth.js
│   │   ├── residents.js
│   │   ├── houses.js
│   │   ├── payments.js
│   │   ├── expenses.js
│   │   └── reports.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Layout.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx            # status lunas/belum, dihuni/tidak
│   │   │   ├── FileUpload.jsx       # upload foto KTP
│   │   │   └── Pagination.jsx
│   │   └── charts/
│   │       ├── IncomeExpenseChart.jsx  # bar chart 12 bulan
│   │       └── BalanceSummaryCard.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── residents/
│   │   │   ├── ResidentListPage.jsx
│   │   │   ├── ResidentFormPage.jsx
│   │   │   └── ResidentDetailPage.jsx
│   │   ├── houses/
│   │   │   ├── HouseListPage.jsx
│   │   │   ├── HouseFormPage.jsx
│   │   │   ├── HouseDetailPage.jsx     # history penghuni + history bayar
│   │   │   └── AssignResidentModal.jsx
│   │   ├── payments/
│   │   │   ├── BillListPage.jsx
│   │   │   ├── BillFormPage.jsx
│   │   │   └── PaymentFormPage.jsx
│   │   ├── expenses/
│   │   │   ├── ExpenseListPage.jsx
│   │   │   └── ExpenseFormPage.jsx
│   │   └── reports/
│   │       ├── MonthlySummaryPage.jsx
│   │       └── AnnualChartPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── formatCurrency.js    # Rp 100.000
│   │   └── formatDate.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example                 # VITE_API_BASE_URL
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Catatan Teknis Penting

### Payment Transaction (Stabil)

```php
// PaymentService.php
DB::transaction(function () use ($bill, $request) {
    $payment = Payment::create([
        'payment_bill_id' => $bill->id,
        'jumlah_bayar'    => $request->jumlah_bayar,
        'tgl_bayar'       => $request->tgl_bayar,
        'keterangan'      => $request->keterangan,
    ]);

    if ($payment->jumlah_bayar >= $bill->total_tagihan) {
        $bill->update(['status' => 'lunas']);
    }

    return $payment;
});
// Jika gagal di mana saja -> otomatis rollback
```

### Soft Deletes (Data Safety)
- Model `Resident`, `House`, dan `Expense` menggunakan trait `SoftDeletes`.
- Data tidak benar-benar dihapus dari database (hanya kolom `deleted_at` terisi).
- Menjaga integritas data historis pada `house_resident_history` dan `payment_bills`.

### Manual Billing Trigger (User Friendly)
- Disediakan tombol "Generate Tagihan" di Dashboard/Billing.
- Admin bisa trigger manual jika ada perubahan data mendadak atau butuh tagihan instan.
- Sistem akan mengecek agar tidak ada double tagihan pada bulan yang sama.

### Developer Export (Security)
- Fitur export data lengkap (Excel) untuk kebutuhan backup/audit developer.
- Mengambil data termasuk yang sudah di-soft-delete (`withTrashed()`).
- Endpoint terproteksi middleware khusus atau hanya user dengan role tertentu.

### Foto KTP
- Simpan di `storage/app/public/ktp/`
- Expose via `php artisan storage:link`
- Validasi: `mimes:jpg,jpeg,png|max:2048`
- URL via `Storage::url($path)`

### Cross-Platform

| Hal | Windows | Linux |
|---|---|---|
| PHP | XAMPP / Laragon | apt install php8.2 |
| MySQL | XAMPP bawaan | apt install mysql-server |
| Storage link | php artisan storage:link | sama |
| npm run dev | sama | sama |

> WARNING: Jangan hardcode path separator. Selalu gunakan `storage_path()`, `public_path()`, atau `Storage::path()`.

### CORS (config/cors.php)
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => true,
```

### Bill Generation Logic
- Penghuni **tetap** -> tagihan auto-generate tiap bulan
- Penghuni **kontrak** -> tagihan dibuat manual saat ada penghuni
- `jumlah_bulan` bisa > 1 untuk pembayaran tahunan (kebersihan)
- `total_tagihan = fee_type.nominal x jumlah_bulan`

---

## Checklist Pengerjaan (Urut)

### Setup Awal
- [x] Init repo Git (monorepo: `/backend` + `/frontend`)
- [x] Setup Laravel 11: `composer create-project laravel/laravel backend`
- [ ] Setup React+Vite: `npm create vite@latest frontend -- --template react`
- [ ] Config `.env` backend (DB_*, APP_URL, FRONTEND_URL)
- [ ] Config `.env` frontend (VITE_API_BASE_URL)

### Backend: Database
- [x] Migration `residents` (add `deleted_at`)
- [x] Migration `houses` (add `deleted_at`)
- [x] Migration `house_resident_history`
- [x] Migration `fee_types`
- [x] Migration `payment_bills`
- [x] Migration `payments`
- [x] Migration `expenses` (add `deleted_at`)
- [ ] `php artisan migrate`
- [ ] Seeder: `UserSeeder`, `FeeTypeSeeder`, `HouseSeeder`
- [ ] `php artisan db:seed`

### Backend: Models & Relations
- [x] Model `Resident`
- [x] Model `House` (relations: resident aktif, histories)
- [x] Model `HouseResidentHistory`
- [x] Model `FeeType`
- [x] Model `PaymentBill` (relations: house, resident, feeType, payments)
- [x] Model `Payment`
- [x] Model `Expense`

### Backend: Auth
- [x] Install Sanctum: `php artisan install:api`
- [ ] `AuthController`: login (return token), logout, me
- [ ] Route: POST /api/v1/auth/login, POST /api/v1/auth/logout, GET /api/v1/auth/me
- [ ] Middleware `auth:sanctum` pada route terproteksi

### Backend: CRUD Penghuni
- [ ] `StoreResidentRequest` + `UpdateResidentRequest`
- [ ] `ResidentController`: index (paginate+filter), store, show, update, destroy (Soft Delete)
- [ ] Upload & simpan foto KTP via Storage
- [ ] `php artisan storage:link`
- [ ] Route resource `/api/v1/residents`

### Backend: CRUD Rumah
- [ ] `StoreHouseRequest`
- [ ] `HouseController`: index, store, show, update
- [ ] `HouseResidentController`: assign penghuni (insert history, update house), unassign (set tgl_keluar)
- [ ] Route: resource `/api/v1/houses`, nested `/api/v1/houses/{house}/residents`

### Backend: Tagihan & Pembayaran
- [ ] `BillGeneratorService` (Logic: prevent duplicate for same month)
- [ ] `PaymentBillController`: index (filter bulan/status), store (Manual Trigger), show
- [ ] `StorePaymentRequest`
- [ ] `PaymentService`: proses bayar dalam `DB::transaction`, update status bill
- [ ] `PaymentController`: store
- [ ] Route: `/api/v1/bills`, `/api/v1/bills/{bill}/pay`

### Backend: Developer Features
- [ ] `DeveloperExportController`: export residents, houses, expenses (include trashed)
- [ ] Route: GET /api/v1/dev/export-residents, etc.

### Backend: Pengeluaran
- [ ] `StoreExpenseRequest`
- [ ] `ExpenseController`: index (filter bulan), store, show, update, destroy (Soft Delete)
- [ ] Route resource `/api/v1/expenses`

### Backend: Laporan
- [ ] `ReportController@monthlySummary` (param: year) -> total pemasukan vs pengeluaran per bulan
- [ ] `ReportController@monthlyDetail` (param: year, month) -> detail transaksi bulan tertentu
- [ ] Route: GET /api/v1/reports/monthly-summary, GET /api/v1/reports/monthly-detail

### Backend: Finalisasi
- [ ] Config CORS
- [ ] Global exception handler (return JSON konsisten)
- [ ] Test semua endpoint via Postman / Insomnia
- [ ] Tulis `backend/README.md` (instalasi lengkap)

### Frontend: Setup
- [ ] Install semua dependencies
- [ ] Config Tailwind CSS
- [ ] Config `axiosInstance.js` (base URL, interceptor attach token, interceptor 401 redirect login)
- [ ] Setup `AuthContext` + `useAuth`
- [ ] Setup `react-router-dom` di `App.jsx` (protected routes)

### Frontend: Auth
- [ ] `LoginPage.jsx`
- [ ] Simpan token ke localStorage, inject ke Axios header

### Frontend: Layout
- [ ] `Sidebar.jsx`
- [ ] `Navbar.jsx`
- [ ] `Layout.jsx`

### Frontend: UI Components
- [ ] `Button`, `Modal`, `Table`, `Badge`, `Pagination`, `FileUpload`
- [ ] **UI Focus**: Design simpel, warna kontras, font besar (User Friendly)

### Frontend: Penghuni
- [ ] `ResidentListPage` (table + search + paginate)
- [ ] `ResidentFormPage` (tambah/edit + preview foto KTP)
- [ ] `ResidentDetailPage`

### Frontend: Rumah
- [ ] `HouseListPage`
- [ ] `HouseFormPage`
- [ ] `HouseDetailPage` (history penghuni + history bayar)
- [ ] `AssignResidentModal`

### Frontend: Tagihan & Pembayaran
- [ ] `BillListPage` (filter bulan + status)
- [ ] `BillFormPage` (UI Tombol Generate Tagihan Manual)
- [ ] `PaymentFormPage` (input pembayaran)

### Frontend: Pengeluaran
- [ ] `ExpenseListPage`
- [ ] `ExpenseFormPage`

### Frontend: Dashboard & Laporan
- [ ] `DashboardPage` (summary card + grafik tahunan)
- [ ] `IncomeExpenseChart` (BarChart Recharts, 12 bulan)
- [ ] `MonthlySummaryPage`

### Finalisasi
- [ ] Buat ERD (dbdiagram.io -> export PNG)
- [ ] Screenshot setiap fitur
- [ ] Tulis `frontend/README.md`
- [ ] Tulis root `README.md` (overview + cara jalankan)
- [ ] Push ke GitHub (public repo)
- [ ] Test instalasi bersih dari 0 ikuti README

---

## Panduan Instalasi (Outline untuk README)

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# edit DB_* di .env
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# set VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
# buka http://localhost:5173
```

> PENTING: Jalankan `php artisan storage:link` SEKALI setelah setup.
> Di Windows, run terminal sebagai Administrator jika ada error symlink.
