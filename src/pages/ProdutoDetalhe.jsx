import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { obterProduto } from '../services/produtosService'
import { formatarPreco } from '../lib/formato'
import { useCart } from '../context/CartContext'

// Converte o valor de um atributo (que pode ter tipos variados) em texto legivel.
function formatarValorAtributo(valor) {
  if (Array.isArray(valor)) return valor.join(', ')
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Nao'
  return String(valor)
}

// Pagina de detalhe de um produto.
export default function ProdutoDetalhe() {
  const { id } = useParams()
  const { adicionar } = useCart()

  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [quantidade, setQuantidade] = useState(1)

  // Busca o produto pelo id sempre que ele mudar.
  useEffect(() => {
    let ativo = true
    setCarregando(true)
    obterProduto(id).then((resultado) => {
      if (!ativo) return
      setProduto(resultado)
      setCarregando(false)
    })
    return () => {
      ativo = false
    }
  }, [id])

  // Estado de carregamento.
  if (carregando) {
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    )
  }

  // Produto inexistente.
  if (!produto) {
    return (
      <div className="container">
        <div className="vazio">
          <div className="vazio-emoji">🔍</div>
          <p>Produto nao encontrado</p>
          <Link className="btn btn-secundario" to="/">
            Voltar para a home
          </Link>
        </div>
      </div>
    )
  }

  const atributos = produto.atributos || {}
  const chaves = Object.keys(atributos)

  function alterarQuantidade(delta) {
    setQuantidade((atual) => Math.max(1, atual + delta))
  }

  function handleAdicionar() {
    adicionar(produto, quantidade)
  }

  return (
    <div className="container">
      <motion.div
        className="detalhe"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="detalhe-imagem">
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        <div className="detalhe-info">
          <h1>{produto.nome}</h1>

          <p className="avaliacao">
            <span aria-hidden="true">⭐</span> {produto.avaliacao}
          </p>

          <p className="preco">{formatarPreco(produto.preco)}</p>
          {produto.precoAntigo != null && (
            <p>
              <s>{formatarPreco(produto.precoAntigo)}</s>
            </p>
          )}

          <p>{produto.descricao}</p>

          {produto.freteGratis && <span className="selo-frete">Frete gratis</span>}

          {chaves.length > 0 && (
            <div className="atributos">
              {chaves.map((chave) => (
                <div className="atributo-linha" key={chave}>
                  <span className="atributo-chave">{chave}</span>
                  <span className="atributo-valor">
                    {formatarValorAtributo(atributos[chave])}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="qtd">
            <button type="button" onClick={() => alterarQuantidade(-1)} aria-label="Diminuir quantidade">
              −
            </button>
            <span>{quantidade}</span>
            <button type="button" onClick={() => alterarQuantidade(1)} aria-label="Aumentar quantidade">
              +
            </button>
          </div>

          <motion.button
            className="btn btn-bloco"
            whileTap={{ scale: 0.97 }}
            onClick={handleAdicionar}
          >
            Adicionar ao carrinho
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
