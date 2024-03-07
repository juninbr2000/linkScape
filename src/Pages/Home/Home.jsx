import React from 'react'
import { Link } from 'react-router-dom'
import midia from '../../assets/midia.jpeg'
import Profilemidia from '../../assets/profileMidia.jpeg'
import styles from './Home.module.css'
import {FaCheck} from 'react-icons/fa'

const Home = () => {
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className='logo'>Link<span>Scape</span></h1>
          <h3>O unico link que você precisa!</h3>
          <Link to='/register' className='button'>Comece agora gratis!</Link>
        </div>
      </header>
      <section className={styles.LinkInfo}>
        <div>
          <h2 className={styles.title}>Um link, infinitas possibilidades</h2>
          <p>A partir de um único link, você pode levar seus seguidores para qualquer outra plataforma ou recurso online. Seja para suas redes sociais, seu blog, seu canal no YouTube ou qualquer outro destino desejado, tudo isso com apenas um link!</p>
        </div>
        <div>
          <img src={midia} alt="" />
        </div>
      </section>
      <section className={styles.Info}>
        <div>
          <h2 className={styles.title}>Seu perfil do seu jeito</h2>
          <p>Personalize seu perfil, adicione suas redes sociais, portfólio, sites e muito mais. Simplifique a experiência dos seus seguidores e concentre todos os seus links em um só lugar.</p>
          <p>Com a nossa plataforma, você tem o controle total sobre como deseja apresentar suas informações na internet. Explore todas as possibilidades e facilite o acesso aos seus conteúdos.</p>
          <Link to={'/register'} className='button'>Cadastre-se Já</Link>
        </div>
        <div>
          <img src={Profilemidia} alt="" />
        </div>
      </section>
      <section className={styles.profile}>
        <h2 className={styles.title}>Da forma que você desejar</h2>
        <p>Crie seu perfil com o nome de usuário que desejar, adicione quantos links quiser e tudo isso de forma gratuita!</p>
        <ul>
          <li><FaCheck /> O nome de usuario que você quiser!</li>
          <li><FaCheck /> Sem limite de links!</li>
          <li><FaCheck /> Gratuito!</li>
        </ul>
      </section>
      <section className={styles.partner}>
        <h2 className={styles.title}>Criado usando as mais modernas tecnologias!</h2>
        <p>Utilizamos tecnologias de ponta, como Firebase e React, para criar uma experiência moderna e eficiente para nossos usuários.</p>
        <div className={styles.image}>
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwlN7V_6GKkcCeVNo3I_IOl177hIQg9uXNdrK3WPSJ8xhzbD5BRuAVYUc0ebj7yVtlZ2w3KLSwXH0Z5Ezh5OSnin7FJL8QQh3cbvH1BHZbyX3Z6XMmPuqYIJq8_PMh2JAiUVKAiLcZxIIE/w1200-h630-p-k-no-nu/image00.png" alt='firebase logo' />
          <img src="https://miro.medium.com/v2/resize:fit:1200/1*vj_VVGBUs-K9NksbZjdeeg.png" alt="React logo" />
        </div>
      </section>
    </div>
  )
}

export default Home