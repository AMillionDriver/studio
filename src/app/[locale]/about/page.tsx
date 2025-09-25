
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Heart, Target, Tv, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">Tentang AniStream</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Dari Penggemar, Untuk Penggemar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          
          <div className="text-center space-y-2">
            <p className="text-xl leading-relaxed">
              AniStream lahir dari sebuah ide sederhana: menciptakan sebuah platform di mana para penggemar anime dapat menemukan semua yang mereka cintai di satu tempat. Kami adalah tim yang bersemangat, yang percaya bahwa anime lebih dari sekadar hiburan—ia adalah bentuk seni, budaya, dan komunitas.
            </p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">Misi Kami</h3>
              </div>
              <p className="text-muted-foreground">
                Misi kami adalah menyediakan akses yang mudah dan terjangkau ke ribuan judul anime, dari serial klasik hingga rilisan terbaru. Kami ingin menjadi jembatan antara para kreator di Jepang dan para penggemar di seluruh dunia, dengan menyediakan platform yang legal, berkualitas tinggi, dan ramah pengguna.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Tv className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">Apa yang Kami Tawarkan</h3>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Koleksi anime yang terus bertambah setiap minggu.</li>
                <li>Streaming berkualitas tinggi (HD) tanpa gangguan.</li>
                <li>Antarmuka yang bersih, cepat, dan mudah dinavigasi.</li>
                <li>Fitur komunitas untuk berdiskusi dan berbagi.</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-semibold">Bergabunglah dengan Petualangan Ini</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              AniStream lebih dari sekadar platform, ini adalah komunitas. Kami mengundang Anda untuk menjelajahi dunia anime bersama kami, menemukan cerita-cerita baru, dan menjadi bagian dari keluarga global kami.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link href="/" className="text-primary hover:underline font-medium">
              Kembali ke Beranda
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
