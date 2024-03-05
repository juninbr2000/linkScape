import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore'

import { useAuthValue } from '../../context/AuthContext';
import { db } from '../../firebase/config';

import { FaCheck, FaUser, FaRegCopy } from 'react-icons/fa'
import styels from "./Profile.module.css"


const Profile = () => {
    const { id } = useParams();
    const { user } = useAuthValue();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const linkUrl = window.location.href
    

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileRef = doc(db, 'profile', id)
                const profileSnapshot = await getDoc(profileRef)

                if (profileSnapshot.exists()) {
                    setProfile(profileSnapshot.data());
                } else {
                    setProfile(null);
                }
                setLoading(false); // Indica que a busca dos dados foi concluída
            } catch (error) {
                console.error('Erro ao recuperar os dados do perfil:', error);
                setLoading(false); // Indica que a busca dos dados foi concluída, mesmo que com erro
            }
        };

        fetchProfileData();
    }, [id]); // Executar a busca sempre que o ID do perfil mudar

    if (loading) {
        return <div className='load'>
            <h1 className='logo'>Link<span>Scape</span></h1>
            <div className="loader"></div>
        </div>;
    }

    if (!profile) {
        return <div>Perfil não encontrado</div>;
    } else {
        console.log(profile)
    }

    const copyLinkButton = () => {
        
    }

    const splitDescription = profile.description.split('\n');
    console.log(splitDescription)
    const links = profile.links
    const ProfileBackgroundColor = {
        backgroundColor: profile.color
    }

    return (
        <div className={styels.container}>
            <div className={styels.container_profile} style={ProfileBackgroundColor}>
                <div className={styels.images_area}>
                    {profile.imageUrl !== null ? <img src={`${profile.imageUrl}`} className={styels.profile_pic} alt='foto de perfil'/> : <div className={styels.no_profile_pic}><FaUser /></div>}
                    <div className={styels.area_name}>
                        <h3>{profile.displayName}</h3><p>{profile.verify === true ? <FaCheck /> : ''}</p>
                    </div>
                </div>
                <div className={styels.info_profile}>
                    <div className={styels.desc}>
                        {splitDescription.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                    {links.length > 0 ? links.map((link) => <a href={link.url} target='_blanck' key={link.id} className={styels.area_link}>{link.title}</a>) : <p>Este usuario ainda nao adicionou nenhum link</p>}
                    {user && user.uid === id && <div className={styels.user_buttons}>
                        <button className={styels.edit} onClick={() => {navigate(`/edit/${id}`)}}>Editar perfil</button>
                        <button className={styels.copy} onClick={copyLinkButton}><FaRegCopy/></button>
                    </div>}
                        {message && <p className={styels.alert}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
