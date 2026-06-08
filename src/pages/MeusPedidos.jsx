import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { listarPedidos } from '../services/pedidosService'
import { formatarPreco } from '../lib/formato'

// Pagina que lista os pedidos ja realizados pelo usuario.
export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarPedidos()
        if (ativo) setPedidos(dados)
      } catch {
        if (ativo) setErro('Nao foi possivel carregar os pedidos.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  // Formata a data de criacao do pedido no padrao pt-BR.
  function formatarData(criadoEm) {
    if (!criadoEm) return ''
    return new Date(criadoEm).toLocaleDateString('pt-BR')
  }

  // Mostra apenas a parte final do id, para um "numero" curto e legivel.
  function idCurto(id) {
    if (!id) return ''
    const partes = String(id).split('-')
    return partes[partes.length - 1]
  }

  if (carregando) {
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="container">
        <p className="erro">{erro}</p>
      </div>
    )
  }

  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="container">
        <div className="vazio">
          <div className="vazio-emoji" aria-hidden="true">
            📦
          </div>
          <p>Voce ainda nao fez pedidos</p>
          <Link className="btn" to="/">
            Ver produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="pagina-titulo">Meus pedidos</h1>

      {pedidos.map((pedido, index) => (
        <motion.div
          className="pedido-card"
          key={pedido.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.06 }}
        >
          <div className="pedido-cabecalho">
            <span>Pedido #{idCurto(pedido.id)}</span>
            <span>{formatarData(pedido.criadoEm)}</span>
            <span className="status-tag">{pedido.status}</span>
          </div>

          <ul>
            {pedido.itens.map((item) => (
              <li key={item.id}>
                {item.nome} x {item.quantidade}
              </li>
            ))}
          </ul>

          <p className="preco">{formatarPreco(pedido.total)}</p>
        </motion.div>
      ))}
    </div>
  )
}
