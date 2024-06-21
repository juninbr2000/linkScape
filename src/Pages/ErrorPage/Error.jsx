import React from 'react'
import { Link } from 'react-router-dom'
import style from './Error.module.css'

const Error = (props) => {
  return (
    <div className={style.container}>
        <h1>404</h1>
        <h3>Ops... Pagina não encontrada!</h3>
        <p>a pagina na qual você esta tentando acessar nao existe ou pode ter sido alterada</p>
        <Link to="/" className="button">Voltar para o inicio</Link>
    </div>
  )
}

export default Error