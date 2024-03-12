import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { useAuthValue } from "../context/AuthContext"
import { useAuthentication } from '../hooks/useAuthentication'

import {FaHome, FaUser, FaKey, FaWalking, FaUserEdit, FaPenSquare} from 'react-icons/fa'
import { BsGearFill } from 'react-icons/bs'
import styles from './Navbar.module.css'

const Navbar = () => {
    const { user } = useAuthValue()
    const {logout} = useAuthentication()
    const navigate = useNavigate()

    const clickconfig = ()=>{
        navigate('/config')
    }

    
  return (
    <nav className={styles.nav}>
        <div className={styles.menuTop}>
            <h1 className="logo"><NavLink to="/">Link<span>Scape</span></NavLink></h1>


        </div>
        <ul className={styles.menuList}>
            <div className={styles.list}>
            <li>
                <NavLink to='/' className={({isActive}) => (isActive ? styles.active : '')}><FaHome/> Home</NavLink>
            </li>
            {!user && (
                <>
                    <li>
                        <NavLink to='/login' className={({isActive}) => (isActive ? styles.active : '')}><FaKey /> Entrar</NavLink>
                    </li>
                    <li>
                        <NavLink to='/register' className={({isActive}) => (isActive ? styles.active : '')}><FaPenSquare /> Cadastrar</NavLink>
                    </li>
                </>
            )}
            {user && (
                <>
                    <li>
                        <NavLink to={`/${user.uid}`} className={({isActive}) => (isActive ? styles.active : '')}><FaUser/> Perfil</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/edit/${user.uid}`} className={({isActive}) => (isActive ? styles.active : '')}><FaUserEdit/> Editar Perfil</NavLink>
                    </li>
                </>
            )}
            {user && (
                <li>
                    <button onClick={logout} className={styles.logout}> < FaWalking />Sair</button>
                </li>
            )}

            </div>
        </ul>
    </nav>
  )
}

export default Navbar