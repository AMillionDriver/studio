
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Separator } from "@/components/ui/separator";
import { Monitor, Moon, Sun, Shield, Bell, PlaySquare, Info, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AnimeRating } from "@/types/anime";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ratings: AnimeRating[] = ["G", "PG", "PG-13", "R", "NC-17"];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isParentalControlEnabled, setIsParentalControlEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleParentalControlSave = async () => {
    if (!isParentalControlEnabled) return;
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveSuccess(true);
    
    // Revert button color after a short delay
    setTimeout(() => {
        setSaveSuccess(false);
    }, 2000);
  };


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
            {!isMounted ? (
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-[76px] w-full" />
                    <Skeleton className="h-[76px] w-full" />
                    <Skeleton className="h-[76px] w-full" />
                </div>
            ) : (
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
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label>Bahasa Tampilan</Label>
            <LanguageSwitcher />
          </div>
        </CardContent>
      </Card>
      
      {/* Pengaturan Pemutaran */}
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

      {/* Pengaturan Notifikasi */}
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
      
      {/* Kontrol Orang Tua */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/> Kontrol Orang Tua</CardTitle>
          <CardDescription>
            Batasi konten berdasarkan rating dan lindungi pengaturan dengan PIN.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                    <Label htmlFor="parental-control-switch" className="text-base">Aktifkan Kontrol Orang Tua</Label>
                    <p className="text-sm text-muted-foreground">Sembunyikan konten di atas rating yang dipilih.</p>
                </div>
                <Switch 
                    id="parental-control-switch" 
                    checked={isParentalControlEnabled}
                    onCheckedChange={setIsParentalControlEnabled}
                />
            </div>

            <div className={cn("space-y-6 transition-opacity", !isParentalControlEnabled && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                    <Label htmlFor="content-rating-select">Batasan Konten</Label>
                    <Select disabled={!isParentalControlEnabled}>
                        <SelectTrigger id="content-rating-select" className="w-[280px]">
                            <SelectValue placeholder="Pilih rating maksimum" />
                        </SelectTrigger>
                        <SelectContent>
                            {ratings.map(r => (
                              <SelectItem key={r} value={r}>
                                {r === 'G' && 'G - Semua Umur'}
                                {r === 'PG' && 'PG - Perlu Bimbingan Orang Tua'}
                                {r === 'PG-13' && 'PG-13 - Peringatan Keras untuk Orang Tua'}
                                {r === 'R' && 'R - Terbatas'}
                                {r === 'NC-17' && 'NC-17 - Khusus Dewasa'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Anime dengan rating di atas ini tidak akan ditampilkan.</p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="pin-input">PIN Perlindungan</Label>
                    <div className="flex items-center gap-2 max-w-xs">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <Input id="pin-input" type="password" maxLength={4} placeholder="Masukkan 4 digit PIN" disabled={!isParentalControlEnabled}/>
                    </div>
                    <p className="text-sm text-muted-foreground">Gunakan PIN untuk mengubah pengaturan ini atau mengakses konten yang dibatasi.</p>
                </div>
            </div>

            <div>
                <Button 
                    onClick={handleParentalControlSave} 
                    disabled={!isParentalControlEnabled || isSaving}
                    className={cn(
                        saveSuccess && "bg-green-500 hover:bg-green-600"
                    )}
                >
                    {isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Pengaturan"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

