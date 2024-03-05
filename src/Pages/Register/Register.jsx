import { db } from '../../firebase/config'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { useAuthentication } from '../../hooks/useAuthentication'

import styles from './Register.module.css'
import { collection, doc, setDoc } from 'firebase/firestore';


const Register = () => {

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const {createUser, error: AuthError, loading} = useAuthentication();

  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
      e.preventDefault()

      setError("")
      const user = {
          displayName,
          email,
          password,
      }
      if(!displayName || !email || !password){
        setError("Preencha todos os campos!")
        return
      }
      if(password.length < 8){
        setError("As senhas precisam conter pelo menos 8 caracteres");
        return
      }
      if(password !== confirmPassword){
          setError("As senhas precisam ser iguais!!")
          return
      }

      try {
        const res = await createUser(user)

        await setDoc(doc(db, 'profile', res.uid), {
            displayName: displayName,
            email: email,
            imageUrl: "",
            description: '',
            links: [],
            verify: false,
        })
        console.log(res)
        
        navigate(`/edit/${res.uid}`)
      } catch (error){
        setError(error.message)
      }
  }
  useEffect(()=>{
      if(AuthError){
          setError(AuthError)
      }
  })

  return (
    <div className={styles.container_login}>

    <form className={styles.formulario} onSubmit={HandleSubmit}>
        <div>
            <h3>Cadastre-se</h3>
            <p>A Melhor maneira de agrupar seus links!</p>
        </div>
        <div className={styles.inputs_login}>

            <label htmlFor="txtName">Nome: </label>
            <input type="text" id='txtName' placeholder='Nome de usuario' autoComplete='username' value={displayName} onChange={(e)=>setDisplayName(e.target.value)}/>
            
            <label htmlFor="txtEmail">Email: </label>
            <input type="email" id='txtEmail' placeholder='Email de usuario' autoComplete='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>

            <label htmlFor="txtPassword">Senha: </label>
            <input type="password" id='txtPassword' placeholder='Digite sua senha' autoComplete='new-password' value={password} onChange={(e)=>setPassword(e.target.value)} />

            <label htmlFor="txtConfirmPassword">Confirme sua senha: </label>
            <input type="password" id='txtConfirmPassword' placeholder='Confrime sua senha' autoComplete='new-password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />

        </div>
        {error && <p className='error'>{error}</p>}
        {!loading && <button className='button'>Cadastrar</button>}
        {loading && <button className='button' disabled>Aguarde...</button>}
        <p className={styles.register}>já tem uma conta? <Link to={'/login'}>faça login</Link></p>
    </form>
</div>
  )
}

export default Register