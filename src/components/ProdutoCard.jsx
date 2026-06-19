import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatarPreco } from '../lib/formato'
import { IconeCaminhao, IconeEstrela } from './icons'

export default function ProdutoCard({ produto }) {
  const { adicionar } = useCart()
  const { mostrar } = useToast()

  const temDesconto = produto.precoAntigo && produto.precoAntigo > produto.preco
  const desconto = temDesconto
    ? Math.round((1 - produto.preco / produto.precoAntigo) * 100)
    : 0
  const economia = temDesconto ? produto.precoAntigo - produto.preco : 0
  const esgotado = produto.estoque === 0

  function adicionarAoCarrinho() {
    adicionar(produto)
    mostrar('Adicionado ao carrinho', { link: '/carrinho', linkTexto: 'Ver carrinho' })
  }

  return (
    <motion.article
      className="produto-card"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <div className="produto-imagem">
        <Link to={`/produto/${produto.id}`} aria-label={produto.nome}>
          <img src={produto.imagem} alt={produto.nome} loading="lazy" />
        </Link>
        {temDesconto && <span className="produto-tag">-{desconto}%</span>}
      </div>

      <div className="produto-corpo">
        <h3 className="produto-nome">
          <Link to={`/produto/${produto.id}`}>{produto.nome}</Link>
        </h3>

        {produto.avaliacao != null && (
          <div className="produto-avaliacao">
            <span className="estrelas">
              <IconeEstrela size={13} />
            </span>
            <strong>{produto.avaliacao.toFixed(1)}</strong>
            {produto.vendidos != null && <span>· {produto.vendidos} vendidos</span>}
          </div>
        )}

        <div className="produto-precos">
          <span className="preco">{formatarPreco(produto.preco)}</span>
          {temDesconto && (
            <span className="preco-antigo">{formatarPreco(produto.precoAntigo)}</span>
          )}
        </div>
        {temDesconto && (
          <span className="produto-economia">Economize {formatarPreco(economia)}</span>
        )}

        {produto.freteGratis && (
          <span className="selo-frete">
            <IconeCaminhao size={14} /> Frete grátis
          </span>
        )}

        <div className="produto-rodape">
          <motion.button
            type="button"
            className="btn btn-bloco"
            onClick={adicionarAoCarrinho}
            whileTap={{ scale: 0.96 }}
            disabled={esgotado}
          >
            {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
