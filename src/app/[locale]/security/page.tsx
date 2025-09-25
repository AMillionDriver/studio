
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
            Kami menerapkan berbagai lapisan keamanan untuk memastikan bahwa pengalaman Anda di AniStream aman dan terlindungi. Halaman ini menjelaskan beberapa langkah yang kami ambil untuk melindungi platform kami.
          </p>

          <Separator />

          <div className="space-y-6">
            <div className="flex gap-4">
              <Lock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Enkripsi Data</h3>
                <p>
                  Semua komunikasi antara perangkat Anda dan server kami dienkripsi menggunakan Transport Layer Security (TLS), standar industri untuk komunikasi online yang aman. Ini memastikan bahwa tidak ada pihak ketiga yang dapat mengintip data yang Anda kirimkan, termasuk kata sandi dan informasi pribadi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <UserCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Keamanan Akun Anda</h3>
                <p>
                  Keamanan akun Anda juga bergantung pada Anda. Kami sangat menganjurkan Anda untuk menggunakan kata sandi yang kuat dan unik untuk akun AniStream Anda dan tidak membagikannya dengan siapa pun. Aktifkan autentikasi dua faktor jika tersedia untuk lapisan perlindungan ekstra.
                </p>
              </div>
            </div>

             <div className="flex gap-4">
              <KeyRound className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Praktik Kata Sandi yang Aman</h3>
                <p>
                  Kami tidak pernah menyimpan kata sandi Anda dalam format teks biasa. Semua kata sandi di-*hash* menggunakan algoritma modern yang aman. Ini berarti bahkan kami pun tidak dapat melihat kata sandi Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Infrastruktur yang Aman</h3>
                <p>
                  AniStream dibangun di atas infrastruktur cloud yang aman dan andal dari Google (Firebase). Ini memungkinkan kami memanfaatkan praktik keamanan kelas dunia, termasuk perlindungan terhadap serangan DDoS, firewall canggih, dan pemantauan keamanan 24/7.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Bug className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">Pelaporan Kerentanan</h3>
                <p>
                  Jika Anda menemukan masalah keamanan atau kerentanan di platform kami, kami sangat menghargai jika Anda melaporkannya kepada kami secara bertanggung jawab. Silakan kirim email ke <strong className="text-foreground">security@anistream-placeholder.com</strong> dengan detail temuan Anda. Kami berkomitmen untuk bekerja sama dengan komunitas keamanan untuk mengatasi setiap masalah dengan cepat.
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
