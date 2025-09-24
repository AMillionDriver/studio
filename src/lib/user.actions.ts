
'use server';

import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase/admin-sdk";

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
        // Ensure the admin app is initialized before using its services
        const auth = getAuth(adminApp);
        
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            emailVerified: false, // User will need to verify their email
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
