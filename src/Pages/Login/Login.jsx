import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa'
import { useAuthentication } from '../../hooks/useAuthentication'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config'



import styles from "./Login.module.css"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const { login, error: AuthError, loading } = useAuthentication();
  
  const auth = getAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    
    const user = {
      email,
      password
    };
    
    const res = await login(user);
  }
    
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
                <p>O unico Link que você precisa!</p>
            </div>
            <div className={styles.inputs_login}>

                <label htmlFor="txtEmail">Email: </label>
                <input type="email" id='txtEmail' placeholder='Email de usuario' autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label htmlFor="txtPassword">Senha: </label>
                <input type="password" id='txtPassword' placeholder='Digite sua senha' autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} />

            </div>
            {error && <p className='error'>{error}</p>}
            {!loading && <button className='button'>Entrar</button>}
            {loading && <button className='button' disabled>Aguarde...</button>}
            <p className={styles.register}>não tem uma conta? <Link to={'/register'}>cadastre-se</Link></p>
        </form>
    </div>
  )
}

export default Login 