
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Kebijakan Privasi</CardTitle>
          <CardDescription>
            Terakhir diperbarui: 24 Mei 2024. Privasi Anda penting bagi kami.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p className="font-semibold text-foreground">
            AniStream ("Kami", "Kita", atau "Perusahaan") berkomitmen untuk melindungi privasi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan menjaga informasi Anda saat Anda mengunjungi atau menggunakan aplikasi kami ("Aplikasi").
          </p>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Informasi yang Kami Kumpulkan</h2>
            <p>Kami dapat mengumpulkan informasi tentang Anda dalam berbagai cara, termasuk:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Data Pribadi yang Anda Berikan:</strong> Kami mengumpulkan informasi yang dapat diidentifikasi secara pribadi, seperti nama, alamat email, dan preferensi Anda, yang Anda berikan secara sukarela saat mendaftar atau berinteraksi dengan Aplikasi.
              </li>
              <li>
                <strong>Data Turunan (Data Penggunaan):</strong> Informasi yang dikumpulkan server kami secara otomatis saat Anda mengakses Aplikasi, seperti alamat IP Anda, jenis browser, sistem operasi, waktu akses, dan halaman yang telah Anda lihat secara langsung sebelum dan sesudah mengakses Aplikasi. Ini juga termasuk riwayat tontonan dan interaksi Anda dengan konten.
              </li>
              <li>
                <strong>Data dari Pihak Ketiga:</strong> Informasi dari pihak ketiga, seperti informasi pribadi atau teman jaringan, jika Anda menghubungkan akun Anda ke pihak ketiga dan memberikan izin kepada Aplikasi untuk mengakses informasi ini.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>Memiliki informasi yang akurat tentang Anda memungkinkan kami untuk memberikan Anda pengalaman yang lancar, efisien, dan disesuaikan. Secara khusus, kami dapat menggunakan informasi yang dikumpulkan tentang Anda melalui Aplikasi untuk:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Membuat dan mengelola akun Anda.</li>
              <li>Memberikan rekomendasi konten yang dipersonalisasi.</li>
              <li>Mengirimkan email kepada Anda mengenai akun atau pesanan Anda.</li>
              <li>Meningkatkan efisiensi dan pengoperasian Aplikasi.</li>
              <li>Memantau dan menganalisis penggunaan dan tren untuk meningkatkan pengalaman Anda dengan Aplikasi.</li>
              <li>Memberi tahu Anda tentang pembaruan pada Aplikasi.</li>
              <li>Mencegah aktivitas penipuan, memantau dari pencurian, dan melindungi dari aktivitas kriminal.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Pengungkapan Informasi Anda</h2>
            <p>Kami tidak akan membagikan informasi yang telah kami kumpulkan tentang Anda dalam situasi apa pun kecuali yang dijelaskan di bawah ini:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Oleh Hukum atau untuk Melindungi Hak:</strong> Jika kami percaya bahwa pelepasan informasi tentang Anda diperlukan untuk menanggapi proses hukum, untuk menyelidiki atau memperbaiki potensi pelanggaran kebijakan kami, atau untuk melindungi hak, properti, dan keselamatan orang lain.</li>
                <li><strong>Penyedia Layanan Pihak Ketiga:</strong> Kami dapat membagikan informasi Anda dengan pihak ketiga yang melakukan layanan untuk kami atau atas nama kami, termasuk pemrosesan pembayaran, analisis data, pengiriman email, layanan hosting, dan layanan pelanggan.</li>
                <li><strong>Dengan Persetujuan Anda:</strong> Kami dapat mengungkapkan informasi pribadi Anda untuk tujuan lain apa pun dengan persetujuan Anda.</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Keamanan Informasi Anda</h2>
            <p>
              Kami menggunakan langkah-langkah keamanan administratif, teknis, dan fisik untuk membantu melindungi informasi pribadi Anda. Meskipun kami telah mengambil langkah-langkah yang wajar untuk mengamankan informasi pribadi yang Anda berikan kepada kami, perlu diketahui bahwa terlepas dari upaya kami, tidak ada langkah-langkah keamanan yang sempurna atau tidak dapat ditembus.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Hak-Hak Anda</h2>
            <p>
             Anda memiliki hak untuk meninjau, mengubah, atau menghentikan akun Anda kapan saja. Anda dapat melakukannya dengan masuk ke pengaturan akun Anda dan memperbarui akun Anda. Jika Anda ingin menghentikan akun Anda, kami akan menonaktifkan atau menghapus akun Anda dan informasi dari basis data aktif kami.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Privasi Anak</h2>
            <p>
              Kami tidak dengan sengaja mengumpulkan informasi dari atau memasarkan kepada anak-anak di bawah usia 13 tahun. Jika Anda mengetahui data apa pun yang kami kumpulkan dari anak-anak di bawah usia 13 tahun, silakan hubungi kami menggunakan informasi kontak yang disediakan di bawah ini.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Perubahan pada Kebijakan Privasi Ini</h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Versi yang diperbarui akan ditandai dengan tanggal "Terakhir diperbarui" yang diperbarui dan versi yang diperbarui akan berlaku segera setelah dapat diakses.
            </p>
          </div>
          
          <Separator />

          <div className="pt-4">
            <Link href="/" className="text-primary hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
