import { useState } from "react"
import { NavLink } from "react-router-dom"

import { useAuthValue } from "../context/AuthContext"
import { useAuthentication } from '../hooks/useAuthentication'

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

        <button className={styles.menu} onClick={toggleMenu}>●●●</button>
        <ul className={`${styles.menuList} ${isMenuOpen ? styles.showMenu : ''}`}>
            <h1 className="logo">Link<span>Scape</span></h1>
            <button className={styles.close} onClick={toggleMenu}>X</button>
            <div className={styles.list}>
            <li>
                <NavLink to='/' className={({isActive}) => (isActive ? styles.active : '')} onClick={toggleMenu}><FaHome/> Home</NavLink>
            </li>
            {!user && (
                <>
                    <li>
                        <NavLink to='/login' className={({isActive}) => (isActive ? styles.active : '')} onClick={toggleMenu}><FaKey /> Entrar</NavLink>
                    </li>
                    <li>
                        <NavLink to='/register' className={({isActive}) => (isActive ? styles.active : '')} onClick={toggleMenu}><FaPenSquare /> Cadastrar</NavLink>
                    </li>
                </>
            )}
            {user && (
                <>
                    <li>
                        <NavLink to={`/${user.displayName}`} className={({isActive}) => (isActive ? styles.active : '')} onClick={toggleMenu}><FaUser/> Perfil</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/edit/${user.uid}`} className={({isActive}) => (isActive ? styles.active : '')} onClick={toggleMenu}><FaUserEdit/> Editar Perfil</NavLink>
                    </li>
                </>
            )}
            {user && (
                <li>
                    <button onClick={logout} className={styles.logout}> <FaWalking />Sair</button>
                </li>
            )}

            </div>
        </ul>
    </nav>
  )
}

export default Navbar