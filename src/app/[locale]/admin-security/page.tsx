'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, CheckCircle, XCircle } from "lucide-react";

// Mock data - in a real app, this would come from your database/backend
const roles = [
    {
        name: "Super Admin",
        description: "Akses penuh ke seluruh fitur di panel admin, termasuk manajemen pengguna, konten, dan pengaturan keamanan.",
        permissions: ["Manajemen Anime (CRUD)", "Manajemen Episode (CRUD)", "Lihat Analitik", "Manajemen Pengguna", "Manajemen Keamanan"]
    },
    {
        name: "Content Manager",
        description: "Akses terbatas untuk mengelola konten anime dan episode. Tidak dapat mengakses pengaturan pengguna atau keamanan.",
        permissions: ["Manajemen Anime (CRUD)", "Manajemen Episode (CRUD)"]
    },
    {
        name: "User",
        description: "Tidak memiliki akses ke panel admin.",
        permissions: ["Tidak ada"]
    }
];

const currentAdmins = [
    { email: "nanangnurmansah5@gmail.com", role: "Super Admin", uid: "Lz56srOfOWPJpiNMbPJJznPPik23" }
];


export default function AdminSecurityPage() {
    const { toast } = useToast();
    const [emailToAdd, setEmailToAdd] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddAdmin = async () => {
        if (!emailToAdd) {
            toast({
                title: "Error",
                description: "Email tidak boleh kosong.",
                variant: "destructive"
            });
            return;
        }

        setIsAdding(true);
        // In a real app, you would call a server action here to set the custom claim
        // e.g., const result = await setAdminClaim(emailToAdd);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

        toast({
            title: "Fitur Dalam Pengembangan",
            description: `Fungsi untuk menambahkan admin (${emailToAdd}) belum diimplementasikan.`,
        });

        setIsAdding(false);
        setEmailToAdd('');
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Manajemen Keamanan & Peran</h1>
                <p className="text-muted-foreground">
                    Atur siapa yang dapat mengakses panel admin dan apa yang dapat mereka lakukan.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/>Daftar Peran & Hak Akses</CardTitle>
                    <CardDescription>Berikut adalah peran yang tersedia di platform dan hak akses yang dimiliki masing-masing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {roles.map(role => (
                            <div key={role.name} className="p-4 border rounded-lg bg-muted/50">
                                <h3 className="font-bold text-lg">{role.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                                <h4 className="text-sm font-semibold mb-2">Hak Akses:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {role.permissions.map(permission => (
                                        <li key={permission} className="flex items-center gap-2">
                                            {permission === "Tidak ada" ? <XCircle className="h-4 w-4 text-destructive"/> : <CheckCircle className="h-4 w-4 text-green-500" />}
                                            {permission}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Administrator Saat Ini</CardTitle>
                    <CardDescription>Pengguna yang memiliki akses ke panel admin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Peran</TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentAdmins.map(admin => (
                                    <TableRow key={admin.uid}>
                                        <TableCell className="font-medium">{admin.email}</TableCell>
                                        <TableCell><Badge>{admin.role}</Badge></TableCell>
                                        <TableCell><code>{admin.uid}</code></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" disabled>Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus />Tambah Admin Baru</CardTitle>
                    <CardDescription>Berikan akses admin kepada pengguna lain dengan memasukkan email mereka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            value={emailToAdd}
                            onChange={(e) => setEmailToAdd(e.target.value)}
                            disabled={isAdding}
                        />
                        <Button type="submit" onClick={handleAddAdmin} disabled={isAdding}>
                            {isAdding ? 'Menambahkan...' : 'Tambah'}
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2">
                        PENTING: Menambahkan pengguna sebagai admin belum berfungsi sepenuhnya. Fitur ini masih dalam pengembangan.
                    </p>
                </CardContent>
            </Card>

        </div>
    );
}
