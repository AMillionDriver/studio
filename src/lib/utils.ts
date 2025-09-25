
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ALLOWED_IMAGE_HOSTNAMES = [
    'placehold.co',
    'images.unsplash.com',
    'picsum.photos',
    'encrypted-tbn0.gstatic.com',
    'www.google.com',
    'www.animenewsnetwork.com',
    'za.pinterest.com',
    'pin.it',
    'storage.googleapis.com',
    'lh3.googleusercontent.com' // Added for Google account photos
];

/**
 * Validates an image URL against a list of allowed hostnames.
 * @param url The image URL to validate.
 * @returns The original URL if valid, otherwise a placeholder URL.
 */
export function getValidImageUrl(url: string | undefined | null): string {
    if (!url) {
        return 'https://placehold.co/400x600?text=No+Image';
    }
    try {
        const urlObject = new URL(url);
        if (ALLOWED_IMAGE_HOSTNAMES.includes(urlObject.hostname)) {
            return url;
        }
        // If the hostname is not in the allowlist, return a specific error placeholder
        return `https://placehold.co/400x600/F00/FFF?text=Host+Not+Allowed&font=lato`;

    } catch (e) {
        // If the URL is malformed, return a different placeholder
        return 'https://placehold.co/400x600/FFA500/FFF?text=Invalid+URL&font=lato';
    }
}

export const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
};
