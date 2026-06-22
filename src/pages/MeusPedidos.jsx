import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { listarPedidos, excluirPedido } from '../services/pedidosService'
import { useToast } from '../context/ToastContext'
import { formatarPreco } from '../lib/formato'

// Pagina que lista os pedidos ja realizados pelo usuario.
export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [excluindo, setExcluindo] = useState(null)
  const { mostrar } = useToast()

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

  // Exclui um pedido: o backend repoe os itens no estoque. A lista some na hora
  // (UI reativa) e, se a chamada falhar, a lista e recarregada do servidor.
  async function handleExcluir(pedido) {
    if (excluindo) return
    setExcluindo(pedido.id)
    setPedidos((atual) => atual.filter((p) => p.id !== pedido.id))
    try {
      await excluirPedido(pedido.id)
      mostrar('Pedido excluido — itens devolvidos ao estoque')
    } catch {
      const dados = await listarPedidos().catch(() => null)
      if (dados) setPedidos(dados)
      mostrar('Nao foi possivel excluir o pedido')
    } finally {
      setExcluindo(null)
    }
  }

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
        <h1 className="pagina-titulo">Meus pedidos</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 116, borderRadius: 16, marginBottom: 14 }}
          />
        ))}
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

      <AnimatePresence initial={false}>
        {pedidos.map((pedido) => (
          <motion.div
            className="pedido-card"
            key={pedido.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25 }}
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

            <div className="pedido-rodape">
              <p className="preco">{formatarPreco(pedido.total)}</p>
              <button
                type="button"
                className="btn-secundario btn-perigo"
                onClick={() => handleExcluir(pedido)}
                disabled={excluindo === pedido.id}
              >
                {excluindo === pedido.id ? 'Excluindo...' : 'Excluir pedido'}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
