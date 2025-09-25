
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ratings: AnimeRating[] = ["G", "PG", "PG-13", "R", "NC-17"];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  // Parental Control States
  const [isParentalControlEnabled, setIsParentalControlEnabled] = useState(false);
  const [pin, setPin] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // States for PIN deactivation flow
  const [showDisablePinDialog, setShowDisablePinDialog] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Countdown timer effect
  useEffect(() => {
    if (lockoutTime > Date.now()) {
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(timer);
          setLockoutTime(0);
          setFailedAttempts(0);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleParentalControlSave = async () => {
    if (!isParentalControlEnabled) return;
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate an API call to save PIN and settings
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
        title: "Pengaturan Tersimpan",
        description: "Pengaturan kontrol orang tua Anda telah diperbarui."
    })

    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => {
        setSaveSuccess(false);
    }, 2000);
  };
  
  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
        // Turning ON is always allowed
        setIsParentalControlEnabled(true);
    } else {
        // Turning OFF requires PIN
        if (pin) { // Only show dialog if a PIN is set
            setShowDisablePinDialog(true);
        } else { // If no PIN is set, just turn it off
            setIsParentalControlEnabled(false);
        }
    }
  };
  
  const handlePinConfirmation = () => {
    if (pinInput === pin) {
        toast({ title: "Kontrol Orang Tua Dinonaktifkan" });
        setIsParentalControlEnabled(false);
        setShowDisablePinDialog(false);
        setPinInput("");
        setPinError("");
        setFailedAttempts(0);
    } else {
        const newAttemptCount = failedAttempts + 1;
        setFailedAttempts(newAttemptCount);
        if (newAttemptCount >= 3) {
            toast({
                title: "Terlalu Banyak Percobaan",
                description: "Fitur dinonaktifkan sementara selama 30 detik.",
                variant: "destructive"
            });
            setLockoutTime(Date.now() + 30000); // Lock for 30 seconds
            setShowDisablePinDialog(false);
            setPinInput("");
            setPinError("");
        } else {
            setPinError(`PIN salah. Sisa percobaan: ${3 - newAttemptCount}`);
        }
    }
  };
  
  const isLockedOut = lockoutTime > Date.now();
  const countdown = isLockedOut ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;


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
                <AlertDialog open={showDisablePinDialog} onOpenChange={setShowDisablePinDialog}>
                    <Switch 
                        id="parental-control-switch" 
                        checked={isParentalControlEnabled}
                        onCheckedChange={handleSwitchChange}
                        disabled={isLockedOut}
                    />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penonaktifan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Masukkan PIN perlindungan Anda untuk menonaktifkan Kontrol Orang Tua.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                           <Input 
                                type="password"
                                placeholder="Masukkan 4 digit PIN"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value);
                                    if (pinError) setPinError("");
                                }}
                                maxLength={4}
                            />
                            {pinError && <p className="text-sm text-destructive">{pinError}</p>}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPinError("")}>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handlePinConfirmation}>Konfirmasi</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className={cn("space-y-6 transition-opacity", !isParentalControlEnabled && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                    <Label htmlFor="content-rating-select">Batasan Konten</Label>
                    <Select disabled={!isParentalControlEnabled || isLockedOut}>
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
                        <Input 
                          id="pin-input" 
                          type="password" 
                          maxLength={4} 
                          placeholder="Masukkan 4 digit PIN" 
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          disabled={!isParentalControlEnabled || isLockedOut}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">Gunakan PIN untuk mengubah pengaturan ini.</p>
                </div>
            </div>

            <div>
                <Button 
                    onClick={handleParentalControlSave} 
                    disabled={!isParentalControlEnabled || isSaving || isLockedOut}
                    className={cn(
                        saveSuccess && "bg-green-500 hover:bg-green-600"
                    )}
                >
                    {isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Pengaturan"}
                </Button>
                {isLockedOut && (
                     <p className="text-sm text-destructive mt-2">
                        Terlalu banyak percobaan gagal. Silakan coba lagi dalam {countdown} detik.
                    </p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
