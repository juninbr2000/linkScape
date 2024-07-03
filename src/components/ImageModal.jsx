import React from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { storage, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { FaUser } from 'react-icons/fa';
import styles from './ImageModal.module.css';

const ImageModal = ({ imagem, onClose, userId, userdata, handleImageChange, previewImage, setDeleted, setPreviewImage }) => {
    const deleteImage = async (image) => {
      try {
        const imageRef = ref(storage, image);
        await deleteObject(imageRef);
  
        const userDocRef = doc(db, 'profile', userId);
        await updateDoc(userDocRef, {
          imageUrl: ''
        });
  
        await updateProfile(userdata, {
          photoURL: ''
        });
  
        setDeleted(true);
        setPreviewImage('');
        onClose();
      } catch (error) {
        console.error('Erro ao deletar imagem: ', error);
      }
    };
  
    const imageChange = (e) => {
      const file = e.target.files[0];
      setDeleted(false)
      if (file) {
        handleImageChange(file);
      }
    };
  
    return (
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <button type="button" onClick={onClose} className={styles.closeBtn}>X</button>
          {previewImage !== null ? <img src={previewImage} alt="Preview" /> : (imagem !== null ? <img src={imagem} alt="Profile" /> : <div className={styles.no_Img}><FaUser/></div>)}
          <div className={styles.containerBtn}>
            <input
              type="file"
              id="fileInputModal"
              style={{ display: 'none' }}
              onChange={imageChange}
            />
            <label htmlFor="fileInputModal" className={styles.changeBtn}>Alterar foto</label>
            {imagem !== null ? (<>
              <button onClick={() => deleteImage(imagem)} type="button">Deletar foto</button>
              <p className={styles.alert}>A foto pode levar alguns minutos para ser deletada</p>
              </>
            ) : (
              <button type="button" disabled>Deletar foto</button>
            )}
            <button onClick={onClose} type="button">Fechar</button>
          </div>
        </div>
      </div>
    );
  };
  
  
export default ImageModal;
  