import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthValue } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { FaCheck, FaUser, FaRegCopy } from 'react-icons/fa';
import styles from './Profile.module.css';
import Footer from '../../components/Footer';

const Profile = () => {
    const { displayName } = useParams();
    const { user } = useAuthValue();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileQuery = query(collection(db, 'profile'), where('displayName', '==', displayName));
                const querySnapshot = await getDocs(profileQuery);

                if (!querySnapshot.empty) {
                    const profileData = querySnapshot.docs[0].data();
                    setProfile(profileData);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao recuperar os dados do perfil:', error);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [displayName]);

    useEffect(() => {
        if (!loading && !profile) {
            navigate('*');
        }
    }, [loading, profile, navigate]);

    if (loading) {
        return <div className='load'>
            <h1 className='logo'>Link<span>Scape</span></h1>
            <div className="loader"></div>
        </div>;
    }
    
    if (!profile) {
        return null; // Evitar renderizar qualquer coisa após a navegação
    }
    console.log(profile)

    const copyLinkButton = () => {
        const userUrl = window.location.href;
        
        const inputElement = document.createElement('input');
        inputElement.value = userUrl;
        document.body.appendChild(inputElement);

        inputElement.select();
        inputElement.setSelectionRange(0, 99999);

        document.execCommand('copy');

        document.body.removeChild(inputElement);

        setMessage("Link copiado para área de transferência!");

        setTimeout(() => {
            setMessage('');
        }, 3000);
    };
    
    const isColorDark = (color) => {
        color = color.replace('#', '');
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);
        let brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    };

    const splitDescription = () => {
        return profile.description ? profile.description.split('\n') : [];
    };

    const links = profile.links || [];
    const ProfileBackgroundColor = {
        backgroundColor: profile.color,
        color: isColorDark(profile.color) ? '#fff' : '#000'
    };

    return (
        <div className={styles.container}>
            <div className={styles.container_profile} style={ProfileBackgroundColor}>
                <div className={styles.images_area}>
                    {profile.imageUrl !== '' ? 
                        (<img src={`${profile.imageUrl}`} className={styles.profile_pic} alt='foto de perfil'/>) 
                        : 
                        (<div className={styles.no_profile_pic}><FaUser /></div>)
                    }
                    <div className={styles.area_name}>
                        <h3>{profile.displayName}</h3><p>{profile.verify === true ? <FaCheck /> : ''}</p>
                    </div>
                </div>
                <div className={styles.info_profile}>
                    {profile.description && <div className={styles.desc}>
                        {splitDescription().map((line, index) => (
                            <p key={index} style={{color: isColorDark(profile.color) ? '#fff': '#000'}}>{line}</p>
                        ))}
                    </div>}
                    {links.length > 0 ? links.map((link) => <a href={link.url} target='_blank' key={link.id} className={profile.buttonstyle}>{link.title}</a>) : <p>Este usuário ainda não adicionou nenhum link</p>}
                    {user && user.displayName === profile.displayName && <div className={styles.user_buttons}>
                        <button className={styles.edit} onClick={() => {navigate(`/edit/${user.uid}`)}}>Editar perfil</button>
                        <button className={styles.copy} onClick={copyLinkButton}><FaRegCopy/></button>
                    </div>}
                    {message && <p className={styles.alert}>{message}</p>}
                    <div style={{padding: '50px'}}>
                        <p style={{color: isColorDark(profile.color) ? '#fff': '#000'}}>LinkScape © 2024</p>
                    </div>
                    {!user && <Link to='/register' className={profile.buttonstyle} style={{display: 'block'}}>Faça como {profile.displayName}! Entre para o linkScape</Link>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
