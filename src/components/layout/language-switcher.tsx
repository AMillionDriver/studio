
"use client"

import * as React from "react"
import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "../ui/scroll-area"

const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
    { code: "ko", name: "한국어" },
    { code: "de", name: "Deutsch" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "pt", name: "Português" },
    { code: "it", name: "Italiano" },
    { code: "hi", name: "हिन्दी" },
    { code: "tr", name: "Türkçe" },
    { code: "nl", name: "Nederlands" },
    { code: "pl", name: "Polski" },
    { code: "sv", name: "Svenska" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "th", name: "ไทย" },
    { code: "ms", name: "Bahasa Melayu" },
];


export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  // In a real app, you would use a library like next-international
  // or next-translate to handle language changes.
  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    console.log(`Language changed to: ${code}`);
    // Here you would typically call a function to change the locale.
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Pilih Bahasa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[200px]">
            {languages.map((lang) => (
                <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={selectedLanguage === lang.code}
                >
                    {lang.name}
                </DropdownMenuItem>
            ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
