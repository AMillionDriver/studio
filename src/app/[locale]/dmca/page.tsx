
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DMCA() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Digital Millennium Copyright Act (DMCA) Policy</CardTitle>
          <CardDescription>
            AniStream menghormati hak kekayaan intelektual orang lain dan mengharapkan pengguna kami untuk melakukan hal yang sama.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            Sesuai dengan Digital Millennium Copyright Act of 1998, yang teksnya dapat ditemukan di situs U.S. Copyright Office di <a href="http://www.copyright.gov/legislation/dmca.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://www.copyright.gov/legislation/dmca.pdf</a>, AniStream akan merespons dengan cepat klaim pelanggaran hak cipta yang dilakukan menggunakan layanan AniStream dan/atau situs web AniStream jika klaim tersebut dilaporkan ke Agen Hak Cipta yang Ditunjuk AniStream yang diidentifikasi dalam contoh pemberitahuan di bawah.
          </p>
          
          <Separator />

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Pemberitahuan Pelanggaran Hak Cipta</h2>
            <p className="mb-4">
              Jika Anda adalah pemilik hak cipta, atau diberi wewenang untuk bertindak atas nama pemilik, atau diberi wewenang untuk bertindak di bawah hak eksklusif apa pun di bawah hak cipta, harap laporkan dugaan pelanggaran hak cipta yang terjadi di atau melalui Situs dengan melengkapi Pemberitahuan Dugaan Pelanggaran DMCA berikut dan mengirimkannya ke Agen Hak Cipta yang Ditunjuk AniStream.
            </p>
            <p>
              Setelah menerima Pemberitahuan seperti yang dijelaskan di bawah, AniStream akan mengambil tindakan apa pun, atas kebijakannya sendiri, yang dianggapnya sesuai, termasuk penghapusan materi yang dipermasalahkan dari Situs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Cara Mengajukan Pemberitahuan:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Identifikasi karya berhak cipta yang Anda klaim telah dilanggar.</li>
              <li>Identifikasi materi atau tautan yang Anda klaim melanggar dan yang aksesnya harus dinonaktifkan, termasuk setidaknya, jika berlaku, URL tautan yang ditampilkan di Situs tempat materi tersebut dapat ditemukan.</li>
              <li>Berikan informasi kontak Anda, termasuk alamat surat, nomor telepon, dan, jika tersedia, alamat email.</li>
              <li>
                Sertakan kedua pernyataan berikut dalam isi Pemberitahuan:
                <ul className="list-disc list-inside pl-6 mt-2 space-y-1 bg-muted/50 p-4 rounded-md">
                  <li>"Dengan ini saya menyatakan bahwa saya memiliki keyakinan dengan itikad baik bahwa penggunaan materi berhak cipta yang disengketakan tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum (misalnya, sebagai penggunaan wajar)."</li>
                  <li>"Dengan ini saya menyatakan bahwa informasi dalam Pemberitahuan ini akurat dan, di bawah ancaman hukuman sumpah palsu, bahwa saya adalah pemilik, atau diberi wewenang untuk bertindak atas nama pemilik, dari hak cipta atau hak eksklusif di bawah hak cipta yang diduga dilanggar."</li>
                </ul>
              </li>
              <li>Berikan nama lengkap resmi dan tanda tangan elektronik atau fisik Anda.</li>
            </ol>
            <p className="mt-4">
              Kirim pemberitahuan ini, dengan semua item selesai, ke Agen Hak Cipta yang Ditunjuk AniStream:
              <br />
              <strong className="text-foreground">Email: dmca@anistream-placeholder.com</strong>
            </p>
          </div>
          
          <Separator />

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Pemberitahuan Balasan (Counter-Notification)</h2>
            <p>
              Jika Anda yakin bahwa materi yang Anda posting telah dihapus atau aksesnya dinonaktifkan karena kesalahan atau salah identifikasi, Anda dapat mengajukan pemberitahuan balasan kepada kami. Pemberitahuan balasan tersebut harus berisi informasi spesifik yang diuraikan dalam Bagian 512(g)(3) dari DMCA.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Kebijakan Pelanggar Berulang</h2>
            <p>
              Sesuai dengan DMCA dan hukum yang berlaku lainnya, AniStream telah mengadopsi kebijakan untuk menghentikan, dalam keadaan yang sesuai, pengguna yang dianggap sebagai pelanggar berulang.
            </p>
          </div>
          
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
