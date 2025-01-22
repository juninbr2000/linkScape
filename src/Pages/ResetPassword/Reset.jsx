import React, { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import styles from '../Login/Login.module.css'
import { useNavigate } from 'react-router-dom'
import { BiCheck } from 'react-icons/bi'

const Reset = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState(" ")
    const [sucess, setSucess] = useState(false)
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    
    const resetPassword = async (email) => {
        const auth = getAuth()

        try {
            await sendPasswordResetEmail(auth, email);
            setSucess(true)
            setMessage("email enviado com sucesso, verifique seu Email para alterar a senha!")
            setTimeout(() => {
                setMessage("")
                navigate("/login")
            }, 10000)
          } catch (error) {
            console.error("Erro ao enviar e-mail de recuperação:", error);
            switch (error.code) {
              case "auth/user-not-found":
                setError("Usuário não encontrado. Verifique o e-mail digitado.");
                break;
              case "auth/invalid-email":
                setError("O e-mail informado é inválido.");
                break;
              default:
                setError("Ocorreu um erro. Tente novamente mais tarde.");
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email){
            setError('digite um email')
            return
        }

        resetPassword(email)
    }

  return (
    <div>
        <form className={styles.formulario} onSubmit={handleSubmit}>
            <div className={styles.title}>
                <h3>Recuperar senha</h3>
                <p>Informe o e-mail associado à sua conta para receber um link de redefinição de senha.</p>
            </div>
            <div className={styles.label_input}>
                <label htmlFor="txtEmail">Email: </label>
                <input className={styles.input} type="email" id='txtEmail' placeholder='Digite seu email' autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            {error && <p className='error'>{error}</p>}
            {sucess && <button type='submit' className={styles.button} disabled>Aguarde...</button>}
            {!sucess && <button type='submit' className={styles.button}>Continuar</button>}
        </form>
        {message !== "" && <div className='modal'>
            <h2><BiCheck/></h2>
            <p>{message}</p>
        </div>}
    </div>
  )
}

export default Reset