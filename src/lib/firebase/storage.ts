
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './sdk';

export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  // Create a storage reference with a unique name
  const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}`);

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


export async function uploadAnimeCover(animeId: string, file: File): Promise<string> {
  // Create a storage reference to a unique path
  const storageRef = ref(storage, `anime-covers/${animeId}/${Date.now()}_${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading anime cover:", error);
    throw new Error("Failed to upload cover image.");
  }
}

    