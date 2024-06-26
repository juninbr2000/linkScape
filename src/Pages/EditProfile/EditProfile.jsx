import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAuthValue } from '../../context/AuthContext';
import { useUpdateDocument } from '../../hooks/useUpdadeDocument';
import { uploadProfileImage } from '../../hooks/useUploadProfileImage';

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

import { FaCamera, FaLink, FaPen, FaTrash, FaPaintRoller } from 'react-icons/fa';
import styles from './EditProfile.module.css';
import Footer from '../../components/Footer';
import { updateCurrentUser, updateProfile } from 'firebase/auth';

const EditProfile = () => {
  const { user } = useAuthValue();
  const { id } = useParams();
  const { updateDocument, response } = useUpdateDocument('profile');
  const navigate = useNavigate();

  const [showLinksAdd, setShowLinksAdd] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState([]);
  const [textUrl, setTextUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [color, setcolor] = useState('')
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSalving, setIsSalving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRef = doc(db, 'profile', id);
        const profileSnapshot = await getDoc(profileRef);
        

        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          setDisplayName(profileData.displayName || user.displayName);
          setDescription(profileData.description || '');
          setLinks(profileData.links || []);
          setcolor(profileData.color || '#778899')
          setProfileImage(profileData.imageUrl || null)
          console.log(profileData)
        }
      } catch (error) {
        console.error('Erro ao recuperar os dados do perfil:', error);
      }
    };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (user && user.photoURL && !profileImage) {
      setProfileImage(user.photoURL);
    }
  }, [user, profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file)); // Cria um URL temporário para o objeto File
  };

  const toggleLinksAdd = () => {
    setShowLinksAdd(!showLinksAdd);
    setIsSalving(!isSalving)
    setLinkTitle('');
    setTextUrl('');
    setEditingLink(null);
  };

  const addLink = () => {
    if (textUrl.trim() === '' || linkTitle.trim() === '') {
      return;
    }

    if (editingLink !== null) {
      // Editing existing link
      const updatedLinks = links.map((link) =>
        link.id === editingLink.id
          ? { ...link, title: linkTitle.trim(), url: textUrl.trim() }
          : link
      );
      setLinks(updatedLinks);
      setEditingLink(null);
    } else {
      // Adding new link
      const newLink = {
        id: uuidv4(),
        title: linkTitle.trim(),
        url: textUrl.trim(),
      };
      setLinks([...links, newLink]);
    }

    toggleLinksAdd();
  };

  if(id !== user.uid){
    navigate('*')
  }

  const editLink = (linkId) => {
    setLinkTitle(linkId.title);
    setTextUrl(linkId.url);
    setEditingLink(linkId);
    setShowLinksAdd(true);
  };

  const deleteLink = (linkId) => {
    const updatedLinks = links.filter((link) => link.id !== linkId);
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('')

    if(displayName === ''){
      setError("nome faltando")
      return
    }

    if (!isValidDisplayName(displayName)) {
      setError("Nome de usuário contém caracteres inválidos!");
      return;
    }
    
    const displayNameExist = await checkDisplayNameIsAvaliable(displayName, user.uid);
      if(displayNameExist){
        setError('Este nome de usuario já esta em uso!')
        return
      }

    setIsSalving(true)

    try {
      let imageUrl = null;
      
      if (!document.getElementById('fileInput').files.length){
        imageUrl = profileImage

      } else if (profileImage) {
        // Faz o upload da imagem para o Firebase Storage
        imageUrl = await uploadProfileImage(profileImage);
        console.log(imageUrl)
      }
  
      // Atualiza os dados do perfil com o URL da imagem, se disponível
      const updatedProfileDoc = {
        displayName,
        description,
        links,
        color,
        imageUrl
      };
      const updateProfileData = {
        displayName,
        photoURL: imageUrl,
      }
  
      // Atualiza o documento do perfil no banco de dados
      updateProfile(user, updateProfileData)
      updateDocument(id, updatedProfileDoc);
      navigate(`/${user.displayName}`);
      setIsSalving(false)
    } catch (error) {
      setIsSalving(false)
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const checkDisplayNameIsAvaliable = async (displayName, userId) => {
    const q = query(collection(db, 'profile'), where('displayName', '==', displayName))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.some(doc => doc.id !== userId);
  }

  const isValidDisplayName = (displayName) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(displayName);
  };


  const estilo = {
    backgroundColor: `${color}`
  }

  return (
    <div className={styles.container} style={estilo}>
      <form className={styles.profile_edit} onSubmit={handleSubmit}>
        <div className={styles.image} style={estilo}>
          <label htmlFor="colorbac" style={{color: "#ffffff",display: 'block', alignSelf: 'flex-end', marginRight: '15px'}}><FaPaintRoller/></label>
          <input type="color" id='colorbac' value={color} onChange={(e) => setcolor(e.target.value)} style={{position: 'absolute', opacity: '0', width: '0', height:'0'}}/>
          <label htmlFor="fileInput" className={user.imageUrl !== null ? styles.profile_btn : styles.profile_btn2}>
            {previewImage ? (
              <>
                <img src={previewImage} />
                <FaCamera />
              </>
            ) : profileImage != null ? <><img src={profileImage}/> <FaCamera/> </> : (
              <FaCamera />
            )}
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className={styles.info_profile}>
          {error !== '' && <p className={styles.errorMsg}>{error}</p>}
          <label htmlFor="desc">Descrição:</label>
          <textarea
            name="description"
            id={styles.desc}
            placeholder="Digite aqui uma descrição"
            maxLength={80}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className={styles.links_area}>
            {links.length > 0 &&
              links.map((link) => (
                <div key={link.id} className={styles.link_container}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </a>
                  <button
                    type="button"
                    className={styles.edit}
                    onClick={() => editLink(link)}
                  >
                    <FaPen />
                  </button>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => deleteLink(link.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            <button
              type="button"
              className={styles.link_btn}
              onClick={toggleLinksAdd}
            >
              <FaLink /> Adicionar Link{' '}
            </button>
          </div>
          {isSalving === false ? <button className="button">Salvar Perfil</button> : <button disabled className='button'>Aguarde...</button>}
          <Footer/>
        </div>
        {showLinksAdd === true && (
          <div className={styles.links_add}>
            <button
              type="button"
              onClick={toggleLinksAdd}
              className={styles.close_btn}
            >
              X
            </button>
            <p>Adicione Links ao seu perfil</p>
            <label htmlFor="title-link">Titulo</label>
            <input
              type="text"
              placeholder="Adicione um titulo para seu link"
              value={linkTitle}
              maxLength={20}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
            <label htmlFor="link">Url: </label>
            <input
              type="url"
              name="link"
              placeholder="Adicione aqui o seu link"
              value={textUrl}
              onChange={(e) => setTextUrl(e.target.value)}
            />
            <button
              type="button"
              className="button"
              onClick={addLink}
            >
              <FaLink /> {editingLink ? 'Salvar' : 'Adicionar'} Link
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
