import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { criarPedido } from '../services/pedidosService'
import { formatarPreco } from '../lib/formato'

// Pagina do carrinho: lista os itens, permite ajustar quantidades/remover,
// mostra o resumo e finaliza o pedido com o endereco de entrega.
export default function Carrinho() {
  const { itens, total, atualizar, remover, limpar } = useCart()
  const navigate = useNavigate()

  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function finalizar(e) {
    e.preventDefault()
    setErro('')
    if (!itens || itens.length === 0) {
      setErro('Seu carrinho esta vazio.')
      return
    }
    setEnviando(true)
    try {
      await criarPedido({ itens })
      limpar()
      navigate('/meus-pedidos')
    } catch {
      setErro('Nao foi possivel finalizar o pedido.')
      setEnviando(false)
    }
  }

  // Carrinho vazio
  if (!itens || itens.length === 0) {
    return (
      <div className="container">
        <h1 className="pagina-titulo">Carrinho</h1>
        <div className="vazio">
          <div className="vazio-emoji" aria-hidden="true">
            🛒
          </div>
          <p>Seu carrinho esta vazio</p>
          <Link className="btn" to="/">
            Ver produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="pagina-titulo">Carrinho</h1>

      <div className="carrinho-layout">
        <div>
          {itens.map((item) => (
            <motion.div
              key={item.id}
              className="carrinho-item"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img src={item.imagem} alt={item.nome} className="detalhe-imagem" />
              <div>
                <h3>{item.nome}</h3>
                <p className="preco">{formatarPreco(item.preco)}</p>

                <div className="qtd">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => atualizar(item.id, item.quantidade - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantidade}</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() => atualizar(item.id, item.quantidade + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <p className="preco">
                  {formatarPreco(item.preco * item.quantidade)}
                </p>
                <button
                  type="button"
                  className="btn-secundario"
                  aria-label="Remover"
                  onClick={() => remover(item.id)}
                >
                  Remover
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="resumo">
          <h2>Resumo</h2>
          <div className="resumo-linha">
            <span>Subtotal</span>
            <span className="preco">{formatarPreco(total)}</span>
          </div>
          <div className="resumo-linha">
            <span>Frete</span>
            <span className="selo-frete">Gratis</span>
          </div>
          <div className="resumo-linha resumo-total">
            <span>Total</span>
            <span className="preco">{formatarPreco(total)}</span>
          </div>

          <form className="form" onSubmit={finalizar}>
            {erro && <p className="erro">{erro}</p>}

            <motion.button
              type="submit"
              className="btn btn-bloco"
              whileTap={{ scale: 0.97 }}
              disabled={enviando}
            >
              {enviando ? 'Finalizando...' : 'Finalizar pedido'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  )
}
