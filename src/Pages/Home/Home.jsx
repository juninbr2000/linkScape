import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div>
      <header className={styles.header}>
        <h3>Bem Vindo(a) ao</h3>
        <h1 className='logo'>Link<span>Scape</span></h1>
        <h3>Seu novo agrupador de links gratuito</h3>

        <div>
          <Link to={"/register"}>Cadastre-se</Link>
          <p>ou</p>
          <Link to={"/login"}>Faça Login</Link>
        </div>
      </header>
      <section className={styles.section2}>
        <h2 className={styles.title}>Todas as Suas Redes Sociais em um Único Link</h2>
        <p>Organize e compartilhe todas as suas redes sociais e links importantes em um só lugar com nosso aplicativo. Simplifique a forma como você compartilha suas informações online e torne mais fácil para seus seguidores encontrarem e se conectarem com você em todas as plataformas.</p>
      </section>
      <section className={styles.first_sec}>
        <h2 className={styles.title}>Seus links agrupados de forma mais simples</h2>
        <div>
          <img src="https://www.shutterstock.com/image-vector/realistic-notch-modern-smartphone-slim-600nw-2154306811.jpg" alt="" />
        </div>
        <div>
          <ul>
            <li>O nome de Usuario que você quiser</li>
            <li>Numero de links ilimitado</li>
            <li>Facil edição e manuseio do perfil</li>
          </ul>
        </div>
        <Link to="/register" className='button'>Cadastre-se Gratis</Link>
      </section>

    </div>
  )
}

export default Home