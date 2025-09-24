
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './sdk';

export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  // Create a storage reference
  const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload profile picture.");
  }
}
