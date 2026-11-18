# Presentasi Ruang Hasil Kali Dalam

Alamat produksi: https://mater.kataakhtarnamatimnyaapayah.my.id  
Aplikasi Deno Deploy: https://present-alin.symful.deno.net

Presentasi web untuk Aljabar Linear pertemuan 6 (Bab VI, Ruang Hasil Kali Dalam),
disusun dari `docs/ALIN-6 2AB Modif Nj.pdf`. Materinya mencakup definisi dan
aksioma hasil kali dalam, norm dan jarak, himpunan ortogonal dan ortonormal,
proses Gram–Schmidt, proyeksi ortogonal, dan latihan Bab VI. Seluruhnya 24 slide.

Disusun oleh Kemal Ardian, NIM 251524053, kelas 2B. Anggota kelompok: Arya Nata
Adidjaya (251524039), Dzikra Alghufroon (251524041), Fatur Hanafi (251524043),
Kemal Ardian (251524053), Muhammad Akhtar Khawarizmi (251524055), Nadhief
Musyaffa (251524059).

## Isi folder

```
server.ts                  penyaji file public/ dan rute /api (lokal dan produksi)
session-server.ts          sesi bersama, autentikasi peran, WebSocket, notes, whiteboard
deno.json                  task Deno, konfigurasi deploy, fmt, dan lint
public/index.html          seluruh 24 slide
public/*.css               tema, diagram, dan panel sesi
public/deck.js             navigasi, daftar isi, dan sinkronisasi tampilan
public/session.js          pemilih peran, panel S, whiteboard, catatan presenter
public/{vector-math,scenes,concepts,narrative,axioms,applications}.js
                           diagram dan animasi interaktif
public/assets/anggota/     foto anggota, format 3:4 (720 x 960)
public/assets/applications/  gambar dan demo aplikasi norm
docs/                      PDF sumber, transkrip video, catatan desain dan deploy
deploy/                    konfigurasi VPS dan skrip pengisian catatan presenter
tests/                     pengujian Node (.mjs)
```

Tidak ada dependensi front-end atau CDN. Semua aset disajikan dari `public/`,
sehingga `public/index.html` juga dapat dibuka langsung tanpa server.

## Menjalankan lokal

```sh
deno task start
```

Buka http://localhost:8000. Port dan alamat dapat diubah lewat `PORT` dan `HOST`.
Untuk mode pantau saat menyunting:

```sh
deno task dev
```

Sesi bersama lokal memakai `.runtime/shared-v2.sqlite` (diatur lewat
`ALIN_KV_PATH`). Tombol **Pratinjau sendiri tanpa sinkronisasi** di pemilih
peran tidak memerlukan koneksi ke server sesi.

Catatan presenter bawaan belum otomatis terisi pada database lokal. Untuk
menyuntikkan 28 panduan dari `deploy/presenter-guides.json` tanpa menimpa catatan
yang sudah ada:

```sh
deno task seed-guides
```

Skrip menerima path database sebagai argumen pertama atau lewat `ALIN_KV_PATH`.

## Navigasi

| Tombol | Fungsi |
| --- | --- |
| `Panah kanan`, `Panah bawah`, `spasi`, `Enter`, `D` | Maju, termasuk membuka potongan penjelasan satu per satu |
| `Panah kiri`, `Panah atas`, `Backspace`, `A` | Mundur |
| `Home`, `End` | Slide pertama atau terakhir |
| `T` atau `O` | Buka atau tutup daftar isi |
| `F` | Layar penuh |
| `Esc` | Tutup daftar isi |
| `W` | Buka atau tutup catatan presenter |
| `S` | Panel sesi dan whiteboard |
| `Ctrl+Z` / `Ctrl+Y` | Urungkan / ulangi coretan |

Geser layar ke kiri atau ke kanan juga bekerja di layar sentuh. Tambahkan `?all#12`
pada alamat untuk membuka slide 12 dengan semua potongan penjelasan tampak.

## Sesi bersama

Buka satu alamat yang sama, lalu pilih **Host**, **Presenter**, atau **Guest**.

- **Host** dan **Presenter** memasukkan password sesi. Server memeriksa password,
  menerbitkan token per peran yang berlaku 12 jam untuk menyambung kembali, dan
  menyimpan token hanya di memori halaman. Keduanya dapat mengendalikan slide,
  animasi, dan whiteboard; label Host menandai perangkat yang membagikan layar.
- **Guest** masuk tanpa password. Guest dapat memilih slide dan menjalankan
  animasi sendiri serta melihat coretan, tetapi tidak dapat mengubah sesi
  bersama, menggambar, atau membaca catatan presenter.
- Pilihan peran ditampilkan kembali setiap halaman dibuka. Keadaan slide, tahap
  animasi, dan coretan disimpan di Deno KV dan dikirim ke perangkat yang bergabung
  terlambat. Saat koneksi terputus, kontrol dinonaktifkan sampai tersambung lagi.
- Tidak ada batas jumlah host atau presenter yang ditetapkan aplikasi; kapasitas
  mengikuti server dan paket hosting. Tidak ada akun pengguna.

## Catatan presenter

Tekan **W** setelah memilih Presenter untuk membuka catatan pada slide aktif.
Saat mengetik, W menjadi huruf biasa; gunakan tombol × atau Escape untuk menutup.
Isi catatan disimpan ke Deno KV per slide dan dibagikan kepada semua presenter,
termasuk yang bergabung kemudian. Host tidak menerima isi catatan.

Penyuntingan dinonaktifkan saat offline; perubahan yang menunggu konfirmasi
dikirim ulang saat tersambung. Jika dua presenter mengedit slide yang sama
bersamaan, penyimpanan terakhir yang menang. Batas tiap catatan 12.000 karakter.
Catatan dapat diseret lewat judulnya; posisi serta buka/tutupnya bersifat lokal
pada masing-masing presenter.

## Whiteboard

Panel **S** menyediakan alat Navigasi, Pena, dan Penghapus. Pena 1 memakai drag
kiri; Pena 2 memakai `Ctrl` + drag kiri; warna dan ketebalan dapat diatur. Coretan
dibuat per slide, disimpan di Deno KV, dan disinkronkan termasuk undo/redo.
Kamera, animasi, dan tahap juga ikut tersinkron, sedangkan layar penuh dan panel
pengaturan tetap lokal.

## Deploy

Konfigurasi produksi VPS ada di [`deploy/README.md`](deploy/README.md): Caddy
menyajikan `public/` dan meneruskan `/api/*` beserta WebSocket ke Deno pada
`127.0.0.1:8000`, sementara systemd menjalankan `mater.service`. Database sqlite
berada di luar direktori rilis dan mendapat cadangan harian.

Aplikasi Deno Deploy `present-alin` di org `symful` memakai runtime **dynamic**
dari `deno.json` dengan entrypoint `./server.ts`. Sebelum deploy, Deno KV harus
dibuat dan ditautkan ke aplikasi; lihat
[petunjuk sesi bersama](docs/deno-shared-session.md). Deploy otomatis terjadi
lewat integrasi GitHub dengan Deno Deploy saat `main` menerima push. Deploy
manual:

```sh
deno deploy --prod
```

Kesehatan layanan dapat diperiksa di `/api/health`.

## Pengujian

```sh
deno lint
deno check server.ts
node --test tests/vector-math.test.mjs
node --test --test-concurrency=1 tests/*.test.mjs
```

Tes integrasi memakai `ALIN_URL` untuk alamat server dan `ALIN_SECOND_URL`
untuk instance kedua dengan KV yang sama. `ALIN_PASSWORD` harus diisi dengan
password sesi yang dikonfigurasi. Jalankan server uji dengan `ALIN_KV_PATH`
terpisah agar data pengujian tidak masuk ke sesi produksi. Pada Windows, set
variabel lingkungan dengan sintaks PowerShell.
