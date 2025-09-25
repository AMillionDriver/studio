
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Lock, UserCheck, Shield, Bug, KeyRound } from "lucide-react";

export default function Security() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Keamanan di AniStream</CardTitle>
          <CardDescription>
            Komitmen kami untuk melindungi akun, data, dan privasi Anda adalah prioritas utama kami.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-muted-foreground">
          
          <p className="font-semibold text-foreground">
            Kami menerapkan berbagai lapisan keamanan untuk memastikan bahwa pengalaman Anda di AniStream aman dan terlindungi. Halaman ini menjelaskan beberapa langkah yang kami ambil untuk melindungi platform kami dan bagaimana Anda dapat membantu menjaga keamanan akun Anda.
          </p>

          <Separator />

          <div className="space-y-6">
            <div className="flex gap-4">
              <Lock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Enkripsi Data</h3>
                <p>
                  Semua komunikasi antara perangkat Anda dan server kami dienkripsi menggunakan Transport Layer Security (TLS), standar industri untuk komunikasi online yang aman. Ini memastikan bahwa tidak ada pihak ketiga yang dapat mengintip data yang Anda kirimkan, termasuk kata sandi dan informasi pribadi Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <UserCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Keamanan Akun Anda</h3>
                <p className="mb-2">
                  Keamanan akun Anda dimulai dari Anda. Kami sangat menganjurkan Anda untuk mengikuti praktik terbaik ini:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Gunakan kata sandi yang kuat dan unik (minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol).</li>
                    <li>Jangan pernah membagikan kata sandi Anda dengan siapa pun.</li>
                    <li>Aktifkan Autentikasi Dua Faktor (2FA) jika tersedia untuk lapisan perlindungan ekstra.</li>
                    <li>Waspadalah terhadap email *phishing* yang menyamar sebagai AniStream dan meminta informasi login Anda.</li>
                </ul>
              </div>
            </div>

             <div className="flex gap-4">
              <KeyRound className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Praktik Kata Sandi yang Aman</h3>
                <p>
                  Kami tidak pernah menyimpan kata sandi Anda dalam format teks biasa. Semua kata sandi di-*hash* menggunakan algoritma kriptografi modern yang aman dan searah. Ini berarti bahkan staf internal kami pun tidak dapat melihat atau mengambil kata sandi Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Infrastruktur yang Aman</h3>
                <p>
                  AniStream dibangun di atas infrastruktur cloud yang aman dan andal dari Google (Firebase). Ini memungkinkan kami memanfaatkan praktik keamanan kelas dunia, termasuk perlindungan terhadap serangan DDoS, firewall canggih, dan pemantauan keamanan 24/7 untuk melindungi data Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Bug className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Program Pelaporan Kerentanan</h3>
                <p>
                  Kami percaya pada kekuatan kolaborasi dengan komunitas keamanan. Jika Anda menemukan masalah keamanan atau kerentanan di platform kami, kami mendorong Anda untuk melaporkannya secara bertanggung jawab. Silakan kirim email ke <strong className="text-foreground">security@anistream-placeholder.com</strong> dengan detail temuan Anda. Kami berkomitmen untuk meninjau semua laporan dan bekerja sama dengan pelapor untuk mengatasi setiap masalah dengan cepat.
                </p>
              </div>
            </div>
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
