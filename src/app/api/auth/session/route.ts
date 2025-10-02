
import { getAuth } from "firebase-admin/auth";
import { FirebaseAdminInitializationError, getAdminApp } from "@/lib/firebase/admin-sdk";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { idToken } = await request.json();

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
        const adminApp = getAdminApp();
        const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
        cookies().set("__session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
        });
        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Error creating session cookie:", error);
        if (error instanceof FirebaseAdminInitializationError) {
            return NextResponse.json(
                { status: "error", message: "Firebase Admin SDK is not configured." },
                { status: 500 }
            );
        }
        return NextResponse.json({ status: "error" }, { status: 401 });
    }
}

export async function DELETE() {
    cookies().delete("__session");
    return NextResponse.json({ status: "success" });
}
