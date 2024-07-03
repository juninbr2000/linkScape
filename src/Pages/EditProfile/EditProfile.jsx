import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAuthValue } from '../../context/AuthContext';
import { useUpdateDocument } from '../../hooks/useUpdadeDocument';
import { uploadProfileImage } from '../../hooks/useUploadProfileImage';

import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

import { FaCamera, FaLink, FaPen, FaTrash, FaPaintRoller, FaUser } from 'react-icons/fa';
import styles from './EditProfile.module.css';
import Footer from '../../components/Footer';
import ImageModal from '../../components/ImageModal';

import { updateCurrentUser, updateProfile } from 'firebase/auth';

const EditProfile = () => {
  const { user } = useAuthValue();
  const { id } = useParams();
  const { updateDocument, response } = useUpdateDocument('profile');
  const navigate = useNavigate();
  console.log(user)

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
  const [buttonstyle, SetButtonStyle] = useState('button1')
  const [error, setError] = useState('')
  const [oldProfileImage, setOldProfileImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [deleted, setDeleted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

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
          SetButtonStyle(profileData.buttonstyle || 'button1')
          setProfileImage(profileData.imageUrl || null);
          setOldProfileImage(profileData.imageUrl || null)
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

  const handleImageChange = (file) => {
    if (file !== '') {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedImage('');
      setPreviewImage('');
      setProfileImage('');
    }
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
    navigate(`/${displayName}`)
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
      let imageUrl = '';
  
      if(deleted === true){
        imageUrl = ''
      } else if (!selectedImage) {
        imageUrl = profileImage;
      } else if (selectedImage) {
        if (oldProfileImage) {
          // Verifica se a imagem antiga existe antes de tentar excluí-la
          try {
            const oldImageRef = ref(storage, oldProfileImage);
            await deleteObject(oldImageRef);
          } catch (error) {
            if (error.code !== 'storage/object-not-found') {
              throw error; // Repassa o erro se não for o erro de objeto não encontrado
            }
          }
        }
        // Faz o upload da nova imagem para o Firebase Storage
        imageUrl = await uploadProfileImage(selectedImage);
        console.log(imageUrl);
      }

      const updatedProfileDoc = {
        displayName,
        description,
        links,
        color,
        imageUrl,
        buttonstyle,
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

  const closeModal = () => setImageModalVisible(false)

  const isColorDark = (color) => {
    color = color.replace('#', '');
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const estilo = {
    backgroundColor: `${color}`,
  }
  const iptColor = {
    color: isColorDark(color) ? '#fff' : '#000'
  }

  return (
    <div className={styles.container} style={estilo}>
      <form className={styles.profile_edit} onSubmit={handleSubmit}>
        <div className={styles.image} style={estilo}>
          <label htmlFor="colorbac" style={{color: "#ffffff",display: 'block', alignSelf: 'flex-end', marginRight: '15px'}}><FaPaintRoller/></label>
          <input type="color" id='colorbac' value={color} onChange={(e) => setcolor(e.target.value)} style={{position: 'absolute', opacity: '0', width: '0', height:'0'}}/>
          <button onClick={() => setImageModalVisible(true)} type='button' className={styles.profile_btn}>
            {!previewImage ? (profileImage !== null ? (<>
                <FaCamera/>
                <img src={profileImage} alt='Foto de perfil' /> 
              </>) : (<>
                <FaUser/>
              </> )
            ) : <img src={previewImage} /> }
          </button>
          {imageModalVisible === true && <ImageModal setDeleted={setDeleted} setPreviewImage={setPreviewImage} previewImage={previewImage} imagem={profileImage} onClose={() => closeModal()} userdata={user} userId={id} handleImageChange={handleImageChange}/>}
          <input
            type="text"
            value={displayName}
            style={iptColor}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className={styles.info_profile}>
          {error !== '' && <p className={styles.errorMsg}>{error}</p>}
          <label htmlFor="desc">Descrição:</label>
          <textarea
            name="description"
            id={styles.desc}
            style={iptColor}
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
                    className={buttonstyle}
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
          <Footer color={color}/>
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

            <p>Personalize o estilo do botão</p>
            <div className={styles.buttons_area}>
              <div>
                <p>fundo transparente</p>
                <button className={`${styles.buttonSelect1} ${buttonstyle === 'button1' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button1')}>Estilo 1</button>
                <button className={`${styles.buttonSelect2} ${buttonstyle === 'button2' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button2')}>Estilo 2</button>
                <button className={`${styles.buttonSelect3} ${buttonstyle === 'button3' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button3')}>Estilo 3</button>
              </div>
              <div>
                <p>fundo branco</p>
                <button className={`${styles.buttonSelect4} ${buttonstyle === 'button4' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button4')}>Estilo 4</button>
                <button className={`${styles.buttonSelect5} ${buttonstyle === 'button5' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button5')}>Estilo 5</button>
                <button className={`${styles.buttonSelect6} ${buttonstyle === 'button6' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button6')}>Estilo 6</button>
              </div>
              <div>
                <p>fundo com cor</p>
                <button className={`${styles.buttonSelect7} ${buttonstyle === 'button7' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button7')}>Estilo 7</button>
                <button className={`${styles.buttonSelect8} ${buttonstyle === 'button8' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button8')}>Estilo 8</button>
                <button className={`${styles.buttonSelect9} ${buttonstyle === 'button9' ? styles.selectedButton : ''}`} type='button' onClick={() => SetButtonStyle('button9')}>Estilo 9</button>
              </div>
            </div>
            <p className={styles.alert}>um unico estilo de botão é aplicado para todo o perfil</p>

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
