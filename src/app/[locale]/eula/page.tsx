
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function EULA() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Perjanjian Lisensi Pengguna Akhir (EULA)</CardTitle>
          <CardDescription>
            Terakhir diperbarui: 24 Mei 2024. Harap baca perjanjian ini dengan saksama.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p className="font-semibold text-foreground">
            Perjanjian Lisensi Pengguna Akhir ("Perjanjian") ini adalah perjanjian yang mengikat secara hukum antara Anda ("Anda" atau "Pengguna") dan AniStream ("Kami", "Kita", atau "Perusahaan"). Dengan mengunduh, menginstal, mengakses, atau menggunakan aplikasi AniStream ("Aplikasi"), Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh ketentuan Perjanjian ini.
          </p>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Pemberian Lisensi</h2>
            <p>
              Kami memberikan Anda lisensi yang terbatas, non-eksklusif, tidak dapat dialihkan, dan dapat dibatalkan untuk mengunduh, menginstal, dan menggunakan Aplikasi untuk tujuan pribadi dan non-komersial Anda, semata-mata sesuai dengan ketentuan Perjanjian ini.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Batasan Penggunaan</h2>
            <p>Anda setuju untuk tidak, dan tidak akan mengizinkan orang lain untuk:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Menyalin, memodifikasi, atau membuat karya turunan dari Aplikasi.</li>
              <li>Mendistribusikan, menjual, menyewakan, meminjamkan, atau mentransfer Aplikasi kepada pihak ketiga mana pun.</li>
              <li>Melakukan rekayasa balik (reverse engineer), membongkar (decompile), atau mencoba mengekstrak kode sumber Aplikasi.</li>
              <li>Menggunakan Aplikasi untuk tujuan ilegal atau dengan cara apa pun yang tidak diizinkan oleh Perjanjian ini.</li>
              <li>Menghapus atau mengubah pemberitahuan hak cipta, merek dagang, atau hak kepemilikan lainnya yang terkandung dalam Aplikasi.</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Hak Kekayaan Intelektual</h2>
            <p>
              Aplikasi dan semua hak cipta, paten, rahasia dagang, merek dagang, dan hak kekayaan intelektual lainnya di dalamnya adalah dan akan tetap menjadi milik tunggal dan eksklusif Perusahaan. Perjanjian ini tidak memberikan Anda hak kepemilikan apa pun dalam atau terhadap Aplikasi.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Pengakhiran</h2>
            <p>
              Perjanjian ini berlaku sampai diakhiri oleh Anda atau Perusahaan. Hak Anda berdasarkan lisensi ini akan berakhir secara otomatis tanpa pemberitahuan dari Kami jika Anda gagal mematuhi salah satu ketentuan Perjanjian ini. Setelah pengakhiran, Anda harus menghentikan semua penggunaan Aplikasi dan menghapus semua salinan Aplikasi dari perangkat Anda.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Penafian Jaminan</h2>
            <p>
              APLIKASI INI DISEDIAKAN "SEBAGAIMANA ADANYA" DAN "SEBAGAIMANA TERSEDIA", DENGAN SEMUA KESALAHAN DAN CACAT TANPA JAMINAN APA PUN. KAMI SECARA TEGAS MENAFIKAN SEMUA JAMINAN, BAIK TERSURAT, TERSIRAT, HUKUM, ATAU LAINNYA, TERMASUK JAMINAN DAPAT DIPERDAGANGKAN, KESESUAIAN UNTUK TUJUAN TERTENTU, DAN NON-PELANGGARAN.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Batasan Tanggung Jawab</h2>
            <p>
              SEJAUH DIIZINKAN OLEH HUKUM YANG BERLAKU, DALAM KEADAAN APA PUN PERUSAHAAN TIDAK AKAN BERTANGGUNG JAWAB ATAS KERUSAKAN TIDAK LANGSUNG, INSIDENTAL, KHUSUS, ATAU KONSEKUENSIAL APA PUN YANG TIMBUL DARI ATAU TERKAIT DENGAN PENGGUNAAN ANDA ATAU KETIDAKMAMPUAN ANDA UNTUK MENGGUNAKAN APLIKASI.
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
