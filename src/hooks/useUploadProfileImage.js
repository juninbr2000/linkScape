import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const uploadProfileImage = async (imageFile) => {
  try {
    const storageRef = ref(storage, `profile_images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error; // Propaga o erro para ser tratado onde a função é chamada
  }
};

export { uploadProfileImage };
