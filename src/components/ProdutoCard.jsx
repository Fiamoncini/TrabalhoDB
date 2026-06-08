import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { formatarPreco } from '../lib/formato'

export default function ProdutoCard({ produto }) {
  const { adicionar } = useCart()

  const temDesconto = produto.precoAntigo && produto.precoAntigo > produto.preco
  const desconto = temDesconto
    ? Math.round((1 - produto.preco / produto.precoAntigo) * 100)
    : 0

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
            <span className="estrelas">★</span>
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

        {produto.freteGratis && <span className="selo-frete">🚚 Frete grátis</span>}

        <div className="produto-rodape">
          <motion.button
            type="button"
            className="btn btn-bloco"
            onClick={() => adicionar(produto)}
            whileTap={{ scale: 0.96 }}
          >
            Adicionar ao carrinho
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
