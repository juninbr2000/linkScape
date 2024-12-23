import React from 'react';
import styles from './Home.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { Link } from 'react-router-dom'
import AutoPlay from '../../components/AutoPlay'
import {FaStar} from 'react-icons/fa'

const Home = () => {
  const { user } = useAuthValue();

  console.log(user);

  return (
    <div className={styles.container}>
      <header className={styles.header_home}>
        <div className={styles.header_info}>
          <h1>Bem vindo ao LinkScape.</h1>
          <h3>acesse todos os seus links, apartir de um unico</h3>
          {!user ? (<>
            <Link className='button' to={'/login'}>Faça login</Link>
            <Link className={styles.secundary} to={'/register'}>Cadastre-se</Link>
          </>) :
          <Link className='button' to={`/${user.displayName}`}>Meu perfil</Link>}
        </div>
        <img src="/undraw_social.svg" alt="social-media" />
      </header>

      <section className={styles.features}>
        <div className={styles.features_info}>
          <h3>O seu perfil, do seu jeito!</h3>
          <p>São diversas maneiras de personalizar seu perfil, e deixa-lo de um jeito unico</p>
          <h3>Diversos link em um so lugar</h3>
          <p>Você pode adicionar quantos links quiser em seu perfil e compartilha-los, com um só link.</p>
          <h3>Forma simples de achar o perfil</h3>
          <p>o Nome é unico, e basta usar-lo para achar o perfil desejado.</p>
        </div>
        <img src="/undraw_editable.svg" alt="ediçao de perfil" />
      </section>

      <section className={styles.social}>
        <div className={styles.social_info}>
          <h2>Todas suas redes sociais em um Link</h2>
          <p>Organize e compartilhe suas redes sociais e seus links mais importantes em um só lugar, e torne mais facil para seus seguidores te acompanharem.</p>
        </div>
        <AutoPlay />
      </section>

      <section className={styles.share}>
        <div className={styles.share_info}>
          <h2>O unico link que você precisa</h2>
          <p>Ao criar você ganha um link unico para acessar seu perfil, atravez do nome de usuario que você escolheu, o que deixa tudo mais facil na hora de compartilhar</p>
          <code className={styles.code}>linkscape.netlify.app/[seu_nome_de_usuario] <FaStar/></code>
        </div>
        <img src="/undraw_share.svg" alt="compartilhamento facil" />
      </section>

      <footer className={styles.footer}>
        LinkScape©2025
      </footer>
    </div>
  );
};

export default Home;
