
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";


const dmcaFormSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap diperlukan."),
  email: z.string().email("Alamat email tidak valid."),
  infringingUrl: z.string().url("URL yang Anda masukkan tidak valid."),
  originalWorkDescription: z.string().min(20, "Deskripsi karya asli diperlukan (minimal 20 karakter)."),
  goodFaithStatement: z.literal(true, {
    errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini." }),
  }),
  accuracyStatement: z.literal(true, {
    errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini." }),
  }),
});

type DmcaFormData = z.infer<typeof dmcaFormSchema>;


export default function DMCA() {
  const form = useForm<DmcaFormData>({
    resolver: zodResolver(dmcaFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      infringingUrl: "",
      originalWorkDescription: "",
    },
  });

  function onSubmit(data: DmcaFormData) {
    // Di masa depan, ini akan mengirimkan data ke backend.
    // Untuk saat ini, kita hanya menampilkan data di console.
    console.log("Formulir DMCA dikirim:", data);
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 md:px-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Digital Millennium Copyright Act (DMCA) Policy</CardTitle>
          <CardDescription>
            AniStream menghormati hak kekayaan intelektual orang lain dan mengharapkan pengguna kami untuk melakukan hal yang sama. Kebijakan ini diperbarui untuk memberikan kejelasan dan kemudahan pelaporan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          
          <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Materi Anda Dilanggar?</h3>
                  <p className="text-sm">Gunakan formulir di bawah ini untuk mengirimkan pemberitahuan DMCA. Pastikan semua informasi lengkap agar kami dapat memprosesnya dengan cepat. Kami akan meninjau setiap pemberitahuan dalam 48 jam kerja.</p>
              </div>
               <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Materi Anda Dihapus?</h3>
                  <p className="text-sm">Jika Anda yakin materi Anda dihapus karena kesalahan, Anda dapat mengirimkan Pemberitahuan Balasan (Counter-Notification) ke email DMCA kami di <strong className="text-foreground">dmca@anistream-placeholder.com</strong>.</p>
              </div>
          </div>
          
          <Separator />

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Formulir Pengajuan Pemberitahuan DMCA</h2>
            <p className="mb-4">
              Untuk mempercepat proses, silakan isi formulir di bawah ini. Ini memastikan kami menerima semua informasi yang diperlukan untuk meninjau klaim Anda.
            </p>
            <Card className="bg-background">
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap Resmi Anda</FormLabel>
                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat Email Kontak</FormLabel>
                                    <FormControl><Input type="email" placeholder="anda@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="infringingUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Materi yang Melanggar</FormLabel>
                                    <FormControl><Input placeholder="https://anistream-placeholder.com/watch/..." {...field} /></FormControl>
                                    <FormDescription>Tautan spesifik di situs kami tempat materi yang melanggar berada.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="originalWorkDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi Karya Asli Anda yang Dilanggar</FormLabel>
                                    <FormControl><Textarea placeholder="Contoh: Saya adalah pemilik hak cipta untuk anime 'Nama Anime' episode 3, yang disiarkan di..." className="min-h-[100px]" {...field} /></FormControl>
                                     <FormDescription>Jelaskan karya asli Anda dan berikan bukti kepemilikan jika memungkinkan (misal: tautan ke karya asli Anda).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            
                            <Separator/>

                             <FormField control={form.control} name="goodFaithStatement" render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Pernyataan Keyakinan Itikad Baik</FormLabel>
                                        <FormDescription>
                                           Dengan ini saya menyatakan bahwa saya memiliki keyakinan dengan itikad baik bahwa penggunaan materi berhak cipta yang disengketakan tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum (misalnya, sebagai penggunaan wajar).
                                        </FormDescription>
                                         <FormMessage />
                                    </div>
                                </FormItem>
                            )}/>
                             <FormField control={form.control} name="accuracyStatement" render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Pernyataan Akurasi</FormLabel>
                                        <FormDescription>
                                           Dengan ini saya menyatakan bahwa informasi dalam Pemberitahuan ini akurat dan, di bawah ancaman hukuman sumpah palsu, bahwa saya adalah pemilik, atau diberi wewenang untuk bertindak atas nama pemilik, dari hak cipta atau hak eksklusif di bawah hak cipta yang diduga dilanggar.
                                        </FormDescription>
                                         <FormMessage />
                                    </div>
                                </FormItem>
                            )}/>
                            
                            <Alert variant="destructive">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertTitle>Fitur Dalam Pengembangan</AlertTitle>
                                <AlertDescription>
                                Tombol pengiriman formulir saat ini dinonaktifkan. Untuk saat ini, silakan kirim laporan Anda secara manual ke <strong className="text-destructive-foreground">dmca@anistream-placeholder.com</strong> dengan menyertakan semua informasi di atas.
                                </AlertDescription>
                            </Alert>

                            <Button type="submit" disabled>Kirim Laporan</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          </div>
          
          <Separator />

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Kebijakan Pelanggar Berulang</h2>
            <p>
              Sesuai dengan DMCA, AniStream telah mengadopsi kebijakan untuk menghentikan, dalam keadaan yang sesuai, pengguna yang dianggap sebagai pelanggar berulang. Kebijakan kami adalah sebagai berikut:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-foreground">Pelanggaran Pertama:</strong> Pengguna akan menerima peringatan resmi melalui email.</li>
                <li><strong className="text-foreground">Pelanggaran Kedua:</strong> Akun pengguna akan ditangguhkan sementara selama 7 hari.</li>
                <li><strong className="text-foreground">Pelanggaran Ketiga:</strong> Akun pengguna akan diblokir secara permanen.</li>
            </ul>
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
