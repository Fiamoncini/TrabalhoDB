import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const [termo, setTermo] = useState('')
  const navigate = useNavigate()
  const { quantidadeTotal } = useCart()
  const { autenticado, usuario, logout } = useAuth()

  function buscar(e) {
    e.preventDefault()
    const t = termo.trim()
    navigate(t ? `/?busca=${encodeURIComponent(t)}` : '/')
  }

  const primeiroNome = usuario?.nome?.split(' ')[0]

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icone">N</span>
          <span className="logo-texto">
            Mercado<span className="logo-marca">NoSQL</span>
          </span>
        </Link>

        <form className="busca" role="search" onSubmit={buscar}>
          <input
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar produtos, marcas e muito mais..."
            aria-label="Buscar produtos"
          />
          <button type="submit" aria-label="Buscar">
            🔍
          </button>
        </form>

        <nav className="topbar-acoes">
          {autenticado ? (
            <>
              <Link className="topbar-link" to="/meus-pedidos">
                📦 <span>Meus pedidos</span>
              </Link>
              <button className="topbar-link" onClick={logout} type="button">
                Olá, {primeiroNome} · Sair
              </button>
            </>
          ) : (
            <Link className="topbar-link" to="/login">
              👤 <span>Entrar</span>
            </Link>
          )}

          <Link className="topbar-link carrinho-botao" to="/carrinho" aria-label="Carrinho">
            🛒 <span>Carrinho</span>
            {quantidadeTotal > 0 && (
              <motion.span
                key={quantidadeTotal}
                className="carrinho-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                {quantidadeTotal}
              </motion.span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
