import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { useAuthValue } from '../../context/AuthContext';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaCheck } from 'react-icons/fa';
import AutoPlay from '../../components/AutoPlay';

const Home = () => {
  const { user } = useAuthValue();

  console.log(user);

  return (
    <div>
      <header className={styles.header}>
        <h3>Bem Vindo(a) ao</h3>
        <h1 className='logo'>Link<span>Scape</span></h1>
        <h3 className={styles.description}>Um Link, Diversas possibilidades</h3>

        <div className={styles.header_btn}>
          {!user ? (
            <>
              <Link to={"/login"} className={styles.primary}>Entrar</Link>
              <p>ou</p>
              <Link to={"/register"} className={styles.secondary}>Criar conta</Link>
            </>
          ) : (
            <Link to={`/${user.displayName}`} className={styles.primary}>Meu Perfil</Link>
          )}
        </div>
      </header>
      <section className={styles.news}>
        <div>
          <h2 className={styles.title}>Novidades</h2>
          <p>Atualizamos integralmente a visualização dos Perfis, expandindo significativamente as opções de personalização com diversas melhorias para proporcionar uma experiência mais aprimorada.</p>
          <p>Além disso, facilitamos a localização dos perfis ao atualizar suas URLs, visando maior acessibilidade e confiabilidade</p>
        </div>
      </section>
      <section className={styles.section}>
        <div>
          <h2 className={styles.title}>Todas as Suas Redes Sociais em um Único Link</h2>
          <p>Organize e compartilhe todas as suas redes sociais e links importantes em um só lugar com LinkScape. Simplifique a forma como você compartilha suas informações online e torne mais fácil para seus seguidores encontrarem e se conectarem com você em todas as plataformas.</p>
        </div>
        <AutoPlay />
      </section>
      <section className={styles.sections_links}>
        <div>
          <h2 className={styles.title}>Das suas redes Sociais ou até o seu site</h2>
          <p>No LinkScape você pode adicionar qualquer link, desde suas redes sociais ou até mesmo o site da sua loja, empresa ou seu portifolio</p>
        </div>
        <div className={styles.btn_container}>
          <h3 className={styles.link_btn}>Facebook</h3>
          <h3 className={styles.link_btn}>Instagram</h3>
          <h3 className={styles.link_btn}>Linkedin</h3>
        </div>
      </section>
      <section className={styles.section3}>
        <div className={styles.features}>
          <h2 className={styles.title}>Recursos Principais do LinkScape</h2>
          <p>Pensamos na melhor e mais simples maneira para adicionar e editar seus links, de forma facil rapida e segura</p>
          <ul className={styles.list}>
            <li>
              <p>Personalização total do seu perfil</p>
            </li>
            <li>
              <p>Integração simples com suas redes sociais favoritas</p>
            </li>
            <li>
              <p>Compatível com todos os dispositivos e navegadores</p>
            </li>
          </ul>
        </div>
        <div className={styles.icons}>
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
          <FaLinkedin />
        </div>
      </section>
    </div>
  );
};

export default Home;
