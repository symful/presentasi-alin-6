# Deploy sesi bersama

1. Gunakan isi repositori yang sudah direvisi, bukan hanya folder public.
2. Pada Deno Deploy organisasi symful, buka Databases → Provision Database → Deno KV.
3. Assign database ke aplikasi present-alin; tunggu status Connected.
4. Deploy revisi setelah pemilik menyetujui perubahan. deno.json sudah memilih
   runtime dynamic, cwd titik, entrypoint ./server.ts, serta fitur kv.
5. Buka /api/health: service alin-session, version 2, session shared.
6. Buka alamat utama di empat perangkat/tab: dua Host, dua Presenter.
   Pastikan penghitung sesuai; gerakkan slide, putar animasi, gambar, undo, redo.
   Muat ulang salah satu host dan pilih Host lagi: keadaan terakhir harus pulih.

Tidak perlu tunnel, PUBLIC_URL, atau alamat localhost untuk produksi. Deno.openKv()
memakai database yang ditautkan oleh Deploy. Data produksi dan preview terpisah
menurut timeline Deno; semua peserta harus memakai alamat produksi yang sama.

Tidak ada login/PIN: memilih Host atau Presenter berarti diberi kendali. Perubahan kontrol
bersamaan diproses berurutan lewat transaksi; keadaan terakhir yang diterima menjadi
acuan. Coretan bersamaan tidak menimpa coretan lain. Tidak ada batas jumlah host atau
presenter yang dikodekan. Kapasitas sangat besar belum diuji.

Keadaan whiteboard dibatasi 700 KB serialisasi (dibagi beberapa key KV) dan 2000
coretan; batas ini bukan batas peserta. Transaksi menggabungkan seluruh revisi secara
atomik. Pesan penolakan ditampilkan di panel S. Snapshot animasi dikirim setiap 80 ms;
latensi antarwilayah dipengaruhi KV/jaringan. Pratinjau pena bersifat sementara;
coretan selesai disimpan. Kehadiran menggunakan heartbeat dan kedaluwarsa.

Verifikasi lokal 17 November 2026: 10 tes numerik/protokol lolos; dua proses Deno
dengan satu KV lokal berbagi keadaan. Uji Edge: dua host, dua presenter, navigasi,
whiteboard, ganti peran menjadi tiga host, dan reload lolos. Deployment akun symful
belum dijalankan atau diverifikasi dalam revisi ini.

Sumber konfigurasi:
- https://docs.deno.com/deploy/reference/builds/
- https://docs.deno.com/deploy/reference/deno_kv/
