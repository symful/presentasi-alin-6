# Presentasi Ruang Hasil Kali Dalam

Situs: https://present-alin.symful.deno.net

Presentasi web untuk Aljabar Linear pertemuan 6 (Bab VI), disusun dari materi
`ALIN-6 2AB Modif Nj`. Isinya: definisi dan aksioma hasil kali dalam, norm,
himpunan ortogonal dan ortonormal, proses Gram-Schmidt, proyeksi ortogonal,
serta latihan Bab VI.

Disusun oleh Kemal Ardian, NIM 251524053, kelas 2B.

Anggota kelompok 2B: Arya Nata Adidjaya (251524039), Dzikra Alghufroon (251524041),
Fatur Hanafi (251524043), Kemal Ardian (251524053), Muhammad Akhtar Khawarizmi
(251524055), Nadhief Musyaffa (251524059).

## Isi folder

```
server.ts        server Deno yang menyajikan folder public/
deno.json        konfigurasi dan task Deno
public/index.html   seluruh slide (24 slide)
public/styles.css   tampilan
public/deck.js      navigasi slide
public/assets/anggota/  foto anggota, sudah dipotong 3:4 (720 x 960)
docs/ALIN-6 2AB Modif Nj.pdf  materi sumber, tidak ikut disajikan
docs/transkrip-video-pak-ebang.md  transkrip rekaman video kelas
```

Tidak ada dependensi front-end. Semua berkas dilayani dari folder `public/`,
jadi halaman tetap tampil tanpa koneksi internet.

## Menjalankan lokal

```sh
deno task start
```

Buka http://localhost:8000. Untuk mode pantau saat menyunting:

```sh
deno task dev
```

## Navigasi

| Tombol | Fungsi |
| --- | --- |
| `Panah kanan`, `spasi`, `Enter` | Maju, termasuk membuka potongan penjelasan satu per satu |
| `Panah kiri`, `Backspace` | Mundur |
| `T` | Buka atau tutup daftar isi |
| `Home`, `End` | Slide pertama atau terakhir |
| `Esc` | Tutup daftar isi |

Geser layar ke kiri atau ke kanan juga bisa dipakai di ponsel.

## Deploy ke Deno Deploy

Presentasi menggunakan runtime **dynamic** agar server dapat menyinkronkan
WebSocket. `server.ts` dipakai lokal dan produksi. Hubungkan Deno KV ke aplikasi
sebelum deploy; lihat [panduan](docs/deno-shared-session.md).

```json
"deploy": {
  "org": "symful",
  "app": "present-alin",
  "runtime": { "type": "dynamic", "entrypoint": "./server.ts", "cwd": "." }
}
```

Deploy berjalan otomatis lewat integrasi GitHub di Deno Deploy: aplikasi
`present-alin` di org `symful` sudah tersambung ke repositori ini, jadi setiap
push ke `main` langsung dibangun dan dirilis oleh Deno Deploy. Pengaturan build
diambil dari bagian `deploy` pada `deno.json`, bukan dari GitHub Actions.

Deploy manual dari mesin sendiri tetap bisa:

```sh
deno deploy --prod
```

## Catatan

Materi mengikuti urutan slide perkuliahan. Contoh 4–9 dan latihan diselaraskan
dengan PDF dosen, termasuk bilangan asli pada Contoh 7 dan 8.

## Pratinjau desain interaktif

Seluruh 24 slide menggunakan tema terang. Tiga belas slide menyediakan diagram
SVG bertahap untuk sudut, norm, ortogonalitas, Gram–Schmidt, dan proyeksi.
Gunakan tombol tahap atau Putar animasi; diagram 3D dapat diputar dengan
menyeret gambar atau penggeser Sudut. Animasi mengikuti preferensi reduced motion.

Berkas tambahan: `public/scenes.js`, `public/scenes.css`, dan
`public/vector-math.js`. Tidak ada CDN atau dependensi front-end tambahan.
`public/index.html` juga dapat dibuka langsung tanpa server.

Pemeriksaan numerik: `node --test tests/vector-math.test.mjs`.
Pemeriksaan server: `deno lint` dan `deno check server.ts`.
Lihat [catatan pemeriksaan](docs/visual-review.md).

## Pengantar konsep

Presentasi kini berisi 27 slide: 24 slide materi dan empat pengantar visual
sebelum perhitungan (ruang vektor, makna hasil kali dalam, ortogonal/ortonormal,
dan proyeksi). `public/concepts.js` menyajikan ilustrasi Euclides; definisi umum
dan contoh PDF tetap dipertahankan. Proyeksi diperkenalkan sebelum Gram–Schmidt.
Putar animasi pada pengantar memberi jeda 6,5 detik per tahap; tombol tahap
memungkinkan penjelasan sesuai tempo pembicara.

## Revisi cakupan ALIN-6 (versi terbaru)

Presentasi sekarang berisi **25 slide**, hanya pembahasan ALIN-6. Pengantar
ruang vektor serta pengulangan dot product/proyeksi garis dihapus. Pengantar
RHD memakai geometri norm, contoh berbobot dosen, dan gambaran galat minimum;
perhitungan disajikan terpisah. Identitas sampul: **D4 2B**.
Navigasi: **A / ←** kembali, **D / →** lanjut, termasuk tahapan animasi.
Lihat [audit seluruh bahan dosen](docs/source-scope.md). Catatan jumlah slide
pada bagian revisi sebelumnya merupakan riwayat pengembangan.

## Narasi dan warna vektor

`public/narrative.js` merinci alur diketahui → pertanyaan → penyelesaian →
makna jawaban untuk contoh interaktif. Pengantar RHD memperlihatkan dua vektor
secara bertahap, proyeksi yang disorot, dan arti hasilnya. Aljabar dan koordinat
di bawah diagram mengikuti warna vektornya. Ilustrasi aplikasi baru muncul
pada akhir penjelasan; animasi aplikasi menghormati reduced motion.

## Satu alamat, banyak host dan presenter (27 slide)

Buka alamat situs yang sama, lalu pilih **Host** atau **Presenter**. Semua perangkat
masuk ke satu sesi bersama; tidak ada kode ruang, tautan per peran, atau host utama.
Host dan presenter memiliki kendali yang sama; label Host menandai perangkat yang membagikan layar. Aplikasi tidak menetapkan batas
jumlah kedua peran; kapasitas nyata tetap mengikuti server dan paket hosting.

Tekan **S** untuk status koneksi, jumlah perangkat, salin alamat, ganti peran, dan
whiteboard. Warna, ketebalan, penghapus, Ctrl+Z/Ctrl+Y bekerja pada slide aktif.
Undo/redo bersifat bersama. Kamera, animasi, tahap, dan coretan ikut tersinkron.
Fullscreen dan panel pengaturan tetap lokal pada tiap perangkat.

Setiap kali membuka halaman, pilihan peran ditampilkan kembali. Perangkat yang
bergabung terlambat menerima posisi dan coretan terakhir. Saat koneksi terputus,
kontrol dinonaktifkan sampai tersambung kembali. Pratinjau sendiri tersedia untuk
memeriksa materi tanpa memengaruhi sesi. Siapa pun yang membuka alamat dan memilih
Presenter dapat mengendalikan sesi; tidak ada autentikasi pengguna.

Konfigurasi Deploy kini **dynamic**, entrypoint `server.ts`. Sebelum deploy, pemilik
aplikasi harus membuat **Deno KV** dan menghubungkannya ke aplikasi `present-alin`.
Lihat [petunjuk deployment](docs/deno-shared-session.md). Sesi menggunakan transaksi
KV dan watch lintas instance; data tidak bergantung pada memori satu server atau
komputer presenter. Lokal menggunakan `.runtime/shared-v2.sqlite`.

Pengujian: `node --test tests/vector-math.test.mjs tests/axioms.test.mjs tests/session-protocol.test.mjs`.
Tes protokol memerlukan server; `ALIN_URL` menentukan alamat, `ALIN_SECOND_URL`
dapat menunjuk instance kedua dengan database KV yang sama.

## Notes bersama presenter

Pilih Presenter lalu tekan **W** untuk membuka/menutup sticky notes pada slide
aktif. Saat sedang mengetik, W menjadi huruf biasa; gunakan tombol × atau Escape
untuk menutup. Setiap perubahan disimpan ke Deno KV, dan status “Tersimpan di server”
muncul setelah server mengonfirmasi. Semua presenter membaca dan mengedit notes
yang sama per slide, termasuk presenter yang bergabung kemudian. Host tidak
menerima pesan notes dan tidak dapat membukanya melalui W.

Notes disimpan terpisah dari keadaan slide dan whiteboard, menggunakan identitas
slide. Tidak disimpan di localStorage atau dikirim sebagai bagian dari broadcast
sesi umum. Saat offline, penyuntingan dinonaktifkan. Perubahan yang menunggu
konfirmasi dikirim ulang saat tersambung; jangan tutup tab sebelum status tersimpan.
Jika dua presenter mengedit slide yang sama bersamaan, penyimpanan terakhir menang
(bukan editor penggabung teks serentak). Batas tiap catatan 12.000 karakter.

Pemilihan peran tetap tanpa autentikasi: pembatasan berlaku untuk koneksi berperan
Host; pengguna yang memilih ulang Presenter memperoleh akses presenter.

Tes: `ALIN_URL=http://localhost:8017 node --test tests/shared-notes.test.mjs`
(pada Windows, set variabel lingkungan dengan sintaks PowerShell). Jalankan server
uji dengan ALIN_KV_PATH berbeda agar catatan pengujian tidak masuk sesi produksi.

Notes dapat diseret melalui bagian judulnya menggunakan mouse atau sentuhan. Posisi serta buka/tutup notes berlaku lokal pada masing-masing presenter; isi tetap dibagikan kepada semua presenter. Posisi dipertahankan ketika notes ditutup dan dibuka kembali dalam halaman yang sama, dan dibatasi agar tetap terjangkau di layar. Host tidak menerima isi notes dan tidak dapat membukanya dengan W.
