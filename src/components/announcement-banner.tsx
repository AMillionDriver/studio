
'use client';

import { Megaphone, Star } from "lucide-react";

const announcements = [
    "Selamat datang di AniStream! Platform streaming anime komunitas.",
    "Harap jaga sikap dan hormati pengguna lain di kolom komentar.",
    "Dilarang membagikan tautan eksternal atau melakukan spam.",
    "Laporkan perilaku yang tidak pantas melalui tombol laporan.",
    "Nikmati ribuan judul anime yang tersedia dan terus bertambah!",
];

export function AnnouncementBanner() {

    const duplicatedAnnouncements = [...announcements, ...announcements];

    return (
        <div className="relative flex overflow-x-hidden bg-primary text-primary-foreground py-2 my-4 outline-none">
            <div className="animate-marquee whitespace-nowrap flex items-center" style={{ animationDuration: '60s' }}>
                {duplicatedAnnouncements.map((text, index) => (
                    <span key={index} className="flex items-center text-sm font-semibold mx-4">
                        {index % announcements.length === 0 && <Megaphone className="h-5 w-5 mr-4 flex-shrink-0" />}
                        {text}
                        <Star className="h-4 w-4 text-yellow-300 fill-yellow-300 mx-4" />
                    </span>
                ))}
            </div>
        </div>
    )
}
