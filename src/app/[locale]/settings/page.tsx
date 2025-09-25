
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Separator } from "@/components/ui/separator";
import { Monitor, Moon, Sun, Shield, Bell, PlaySquare, Info } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto max-w-2xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola preferensi akun dan pengaturan aplikasi Anda.
        </p>
      </div>

      {/* Pengaturan Tampilan */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Tampilan</CardTitle>
          <CardDescription>
            Sesuaikan tampilan antarmuka aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Tema Aplikasi</Label>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-4"
            >
              <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Sun className="h-6 w-6 mb-2" />
                <span>Terang</span>
              </Label>
              <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Moon className="h-6 w-6 mb-2" />
                <span>Gelap</span>
              </Label>
              <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Monitor className="h-6 w-6 mb-2" />
                <span>Sistem</span>
              </Label>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label>Bahasa Tampilan</Label>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>
      
      {/* Placeholder untuk Pengaturan Lainnya */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PlaySquare className="h-5 w-5 text-primary"/> Pengaturan Pemutaran</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan. Segera hadir: pilihan kualitas video dan pengaturan autoplay.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button disabled>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Pengaturan Notifikasi</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan. Segera hadir: kontrol notifikasi email dan dalam aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button disabled>Simpan Perubahan</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/> Kontrol Orang Tua</CardTitle>
          <CardDescription>
            Fitur ini sedang dalam pengembangan. Segera hadir: batasan konten berdasarkan rating dan kunci PIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button disabled>Aktifkan</Button>
        </CardContent>
      </Card>

    </div>
  );
}
