import { useState } from "react"
import { NavLink } from "react-router-dom"

import { useAuthValue } from "../context/AuthContext"
import { useAuthentication } from '../hooks/useAuthentication'

import { BiX } from 'react-icons/bi'
import {FaHome, FaUser, FaKey, FaWalking, FaUserEdit, FaPenSquare, FaBars} from 'react-icons/fa'
import styles from './Navbar.module.css'

const Navbar = () => {
    const { user } = useAuthValue()
    const {logout} = useAuthentication()
    const [isMenuOpen, SetIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        SetIsMenuOpen(!isMenuOpen)
    }
    
  return (
    <nav className={styles.nav}>
        <h1 className="logo"><NavLink to="/">Link<span>Scape</span></NavLink></h1>

        <button className={styles.menuBtn} onClick={toggleMenu}>{isMenuOpen ? <BiX /> : <FaBars />}</button>
        <ul className={`${styles.menuList} ${isMenuOpen ? styles.showMenu : ''}`}>
            <li><NavLink to={'/'} onClick={toggleMenu} className={({isActive}) => (isActive ? styles.active : '')} ><FaHome /> Inicio</NavLink></li>
            {!user && <li><NavLink to={'/login'} onClick={toggleMenu} className={({isActive}) => (isActive ? styles.active : '')} ><FaKey /> Login</NavLink></li>}
            {!user && <li><NavLink to={'/register'} onClick={toggleMenu} className={({isActive}) => (isActive ? styles.active : '')} ><FaPenSquare /> Cadastre-se</NavLink></li>}
            {user && <li><NavLink to={`/${user.displayName}`} onClick={toggleMenu} className={({isActive}) => (isActive ? styles.active : '')}><FaUser /> Perfil</NavLink></li>}
            {user && <li><NavLink to={`/edit/${user.uid}`} onClick={toggleMenu} className={({isActive}) => (isActive ? styles.active : '')}><FaUserEdit /> Editar Perfil</NavLink></li>}
            {user && <button onClick={logout} className={styles.logout}><FaWalking/> Sair</button>}
        </ul>
    </nav>
  )
}

export default Navbar