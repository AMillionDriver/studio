
'use server';

import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase/admin-sdk";
import { uploadProfilePicture } from "./firebase/storage";
import { revalidatePath } from "next/cache";

interface CreateUserParams {
    email: string;
    password?: string;
}

/**
 * Creates a new user in Firebase Authentication.
 * This is a Server Action and must be called from a server environment.
 * It requires Firebase Admin SDK to be initialized.
 * 
 * @param data An object containing the new user's email and password.
 * @returns An object indicating success or failure.
 */
export async function createUser(data: CreateUserParams): Promise<{ success: boolean; uid?: string; error?: string }> {
    const { email, password } = data;

    if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
    }

    try {
        const auth = getAuth(adminApp);
        
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            emailVerified: false, 
            disabled: false,
        });

        console.log('Successfully created new user:', userRecord.uid);
        return { success: true, uid: userRecord.uid };

    } catch (error: any) {
        console.error('Error creating new user:', error);
        
        let errorMessage = 'An unknown error occurred while creating the user.';
        if (error.code === 'auth/email-already-exists') {
            errorMessage = 'The email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-password') {
            errorMessage = 'The password must be a string with at least 6 characters.';
        }
        
        return { success: false, error: errorMessage };
    }
}


/**
 * Updates a user's profile (displayName and photoURL) using the Admin SDK.
 * This is a Server Action designed to be called from the client.
 * @param userId The UID of the user to update.
 * @param formData The form data containing `displayName` and optionally `photoFile`.
 * @returns An object indicating success or failure with the new photo URL.
 */
export async function updateUserProfile(userId: string, formData: FormData): Promise<{ success: boolean; photoURL?: string; error?: string }> {
    if (!userId) {
        return { success: false, error: "User ID is required." };
    }

    const displayName = formData.get('displayName') as string | null;
    const photoFile = formData.get('photoFile') as File | null;
    const auth = getAuth(adminApp);

    try {
        let photoURL: string | undefined = undefined;

        // 1. If a new photo file is provided, upload it to Storage
        if (photoFile && photoFile.size > 0) {
            photoURL = await uploadProfilePicture(userId, photoFile);
        }

        // 2. Prepare the data payload for Firebase Auth update
        const updatePayload: { displayName?: string; photoURL?: string } = {};
        if (displayName) {
            updatePayload.displayName = displayName;
        }
        if (photoURL) {
            updatePayload.photoURL = photoURL;
        }

        // 3. Update the user record in Firebase Authentication
        if (Object.keys(updatePayload).length > 0) {
            await auth.updateUser(userId, updatePayload);
        }
        
        // 4. Revalidate paths to ensure data is fresh across the app
        revalidatePath('/profile');
        revalidatePath('/'); // For header updates

        console.log(`Successfully updated profile for user: ${userId}`);
        return { success: true, photoURL: photoURL };

    } catch (error: any) {
        console.error(`Error updating profile for user ${userId}:`, error);
        return { success: false, error: error.message || "An unknown server error occurred." };
    }
}
