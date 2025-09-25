
import { redirect } from 'next/navigation';

// This page just redirects to the main profile page.
// The /settings link is kept for user convenience if they type it directly.
export default function SettingsPage() {
  redirect('/profile');
}

    