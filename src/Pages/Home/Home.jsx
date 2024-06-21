import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import { useAuthValue } from '../../context/AuthContext'

import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'

const Home = () => {

  const {user} = useAuthValue()

  console.log(user)

  return (
    <div>
      <header className={styles.header}>
        <h3>Bem Vindo(a) ao</h3>
        <h1 className='logo'>Link<span>Scape</span></h1>
        <h3>Um unico Link, Diversas possibilidades</h3>

        <div>
        {!user ? <>
            <Link to={"/register"}>Cadastre-se</Link>
            <p>ou</p>
          	<Link to={"/login"}>Faça Login</Link>
          </> : <Link to={`/${user.uid}`}>Meu Perfil</Link> }
        </div>
      </header>
      <section className={styles.section2}>
        <div>
          <h2 className={styles.title}>Todas as Suas Redes Sociais em um Único Link</h2>
          <p>Organize e compartilhe todas as suas redes sociais e links importantes em um só lugar com nosso aplicativo. Simplifique a forma como você compartilha suas informações online e torne mais fácil para seus seguidores encontrarem e se conectarem com você em todas as plataformas.</p>
        </div>
        <div className={styles.icons}>
          <FaFacebook/>
          <FaInstagram/>
          <FaTwitter/>
          <FaLinkedin/>
        </div>
      </section>
      <section className={styles.section3}>
        <div className={styles.features}>
          <h2>Recursos Principais do LinkScape</h2>
          <ul>
            <li>Personalização total do seu link de perfil</li>
            <li>Integração simples com suas redes sociais favoritas</li>
            <li>Compatível com todos os dispositivos e navegadores</li>
          </ul>
        </div>
      </section>
      
    </div>
  )
}

export default Home