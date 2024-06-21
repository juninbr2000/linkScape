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
  const [googleButtonClicked, setGoogleButtonClicked] = useState(false);
  const navigate = useNavigate()

  const { login, error: AuthError, loading } = useAuthentication();

  const provider = new GoogleAuthProvider();
  
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
  
  const handleGoogleLogin = () => {
    setGoogleButtonClicked(true);
    signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const userG = result.user;
      const displayName = userG.displayName || '' ;
      const imageURL = userG.photoURL || '';
      
      const profileRef = doc(db, 'profile', userG.uid); // Obtém a referência para o documento do perfil usando o UID do usuário
      const profileSnapshot = await getDoc(profileRef);
      if (profileSnapshot.exists()) {
        navigate(`/${userG.uid}`)
      } else {
      try {
          setDoc(doc(db, 'profile', userG.uid), {
            displayName: displayName,
            email: userG.email,
            imageUrl: imageURL,
            description: '',
            links: [],
            verify: false,
        })
      } catch (error){
        setError(error.message)
      }}
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      setGoogleButtonClicked(false);
    });
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
            <hr />
            <p>outras formas de login</p>
            <button className={styles.login_google} onClick={handleGoogleLogin} disabled={googleButtonClicked}><FaGoogle /> Google</button>
        </form>
    </div>
  )
}

export default Login 