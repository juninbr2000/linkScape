import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa'
import { useAuthentication } from '../../hooks/useAuthentication'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config'
import { FaEyeSlash, FaEye, FaEyeDropper } from 'react-icons/fa';



import styles from "./Login.module.css"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const { login, error: AuthError, loading } = useAuthentication();
  
  const auth = getAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(email === ''){
      setError('Digite um email')
      return
    }
    if(password === '' || password.length < 7){
      setError('Digite uma senha valida')
      return
    }

    setError("");
    
    const user = {
      email,
      password
    };

    try {
      const res = await login(user);
  
      if (res) {
        // Redireciona para a página de perfil
        console.log(res)
        navigate(`/${res.user.displayName}`);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Falha no login. Verifique suas credenciais.');
    }
  };
    
  useEffect(() => {
    if(AuthError){
      setError(AuthError)
    }
  })


  return (
    <div className={styles.container_login}>
        <form className={styles.formulario} onSubmit={handleSubmit}>
            <div>
                <h3>Login</h3>
                <p>Bem vindo de volta!</p>
            </div>
            <div className={styles.inputs_login}>
              <div className={styles.label_input}>
                <label htmlFor="txtEmail">Email: </label>
                <input className={styles.input} type="email" id='txtEmail' placeholder='Email de usuario' autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>

              <div className={styles.label_input}>
                <label htmlFor="txtPassword">Senha: </label>
                <input className={styles.input} type={visible === false ? 'password' : 'text' } id='txtPassword' placeholder='Digite sua senha' autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className={styles.visibility} type='button' onClick={() => setVisible(!visible)}>{visible === false ? (<FaEyeSlash />) : (<FaEye/>)}</button>
              </div>
            </div>
            <Link to={'/reset'} style={{textAlign: 'end', display: 'block', fontSize: '.9em', color: 'gray', textDecoration: 'none'}}>Esqueceu a senha?</Link>
            {error && <p className='error'>{error}</p>}
            {!loading && <button className={styles.button}>Entrar</button>}
            {loading && <button className={styles.button} disabled>Aguarde...</button>}
            <p className={styles.register}>Ainda não tem uma conta? <Link to={'/register'}>cadastre-se</Link></p>
        </form>
    </div>
  )
}

export default Login 