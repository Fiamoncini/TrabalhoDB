import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { obterProduto, listarProdutos } from '../services/produtosService'
import { categorias } from '../mocks/produtos'
import { formatarPreco } from '../lib/formato'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import ProdutoCard from '../components/ProdutoCard'
import {
  IconeEstrela,
  IconeCaminhao,
  IconeEscudo,
  IconeDevolucao,
  IconeCadeado,
} from '../components/icons'

// Converte o valor de um atributo (que pode ter tipos variados) em texto legivel.
function formatarValorAtributo(valor) {
  if (Array.isArray(valor)) return valor.join(', ')
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Nao'
  return String(valor)
}

export default function ProdutoDetalhe() {
  const { id } = useParams()
  const { adicionar } = useCart()
  const { mostrar } = useToast()

  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [quantidade, setQuantidade] = useState(1)
  const [relacionados, setRelacionados] = useState([])

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    obterProduto(id)
      .then((resultado) => {
        if (ativo) setProduto(resultado)
      })
      .catch(() => {
        if (ativo) setErro('Nao foi possivel carregar o produto.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [id, tentativa])

  // Produtos relacionados (mesma categoria).
  useEffect(() => {
    if (!produto) return
    let ativo = true
    Promise.resolve(listarProdutos({ categoria: produto.categoria }))
      .then((lista) => {
        if (ativo) setRelacionados((lista || []).filter((p) => p.id !== produto.id).slice(0, 4))
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [produto])

  // Carregando — esqueleto que espelha o layout.
  if (carregando) {
    return (
      <div className="container">
        <div className="detalhe">
          <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 26 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 }}>
            <div className="skeleton" style={{ height: 30, width: '85%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 18, width: '40%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 70, width: '100%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 150, width: '100%', borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 130, width: '100%', borderRadius: 12 }} />
          </div>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="container">
        <div className="vazio">
          <div className="vazio-emoji">⚠️</div>
          <h2>Algo deu errado</h2>
          <p>{erro}</p>
          <button className="btn" type="button" onClick={() => setTentativa((t) => t + 1)}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

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
  const temDesconto = produto.precoAntigo && produto.precoAntigo > produto.preco
  const desconto = temDesconto
    ? Math.round((1 - produto.preco / produto.precoAntigo) * 100)
    : 0
  const economia = temDesconto ? produto.precoAntigo - produto.preco : 0
  const esgotado = produto.estoque === 0
  const estoqueBaixo = produto.estoque > 0 && produto.estoque <= 5
  const garantia = atributos.garantiaMeses
  const categoria = categorias.find((c) => c.id === produto.categoria)

  function alterarQuantidade(delta) {
    setQuantidade((atual) => Math.max(1, atual + delta))
  }

  function handleAdicionar() {
    adicionar(produto, quantidade)
    mostrar('Adicionado ao carrinho', { link: '/carrinho', linkTexto: 'Ver carrinho' })
  }

  return (
    <div className="container">
      <nav className="migalhas" aria-label="Trilha de navegacao">
        <Link to="/">Início</Link>
        {categoria && (
          <>
            <span className="sep">/</span>
            <Link to={`/?categoria=${categoria.id}`}>{categoria.nome}</Link>
          </>
        )}
        <span className="sep">/</span>
        <span className="atual">{produto.nome}</span>
      </nav>

      <motion.div
        className="detalhe"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="detalhe-imagem">
          {temDesconto && <span className="produto-tag detalhe-tag">-{desconto}%</span>}
          <img src={produto.imagem} alt={produto.nome} />
        </div>

        <div className="detalhe-info">
          {categoria && <span className="detalhe-categoria">{categoria.nome}</span>}
          <h1>{produto.nome}</h1>

          <p className="avaliacao">
            <span className="estrelas">
              <IconeEstrela size={16} />
            </span>
            <strong>{produto.avaliacao?.toFixed(1)}</strong>
            {produto.vendidos != null && (
              <span style={{ color: 'var(--texto-fraco)' }}>· {produto.vendidos} vendidos</span>
            )}
          </p>

          <p className="detalhe-descricao">{produto.descricao}</p>

          <div className="detalhe-compra">
            <div className="detalhe-precos">
              <span className="preco">{formatarPreco(produto.preco)}</span>
              {temDesconto && (
                <>
                  <span className="preco-antigo">{formatarPreco(produto.precoAntigo)}</span>
                  <span className="selo-desconto">-{desconto}%</span>
                </>
              )}
            </div>
            {temDesconto && (
              <p className="economia">Você economiza {formatarPreco(economia)}</p>
            )}

            {esgotado ? (
              <p className="detalhe-estoque estoque-baixo">Produto esgotado</p>
            ) : estoqueBaixo ? (
              <p className="detalhe-estoque estoque-baixo">
                🔥 Últimas unidades — apenas {produto.estoque} em estoque
              </p>
            ) : (
              <p className="detalhe-estoque estoque-ok">✓ Em estoque</p>
            )}

            <div className="detalhe-compra-acoes">
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
                className="btn btn-grande"
                whileTap={{ scale: 0.97 }}
                onClick={handleAdicionar}
                disabled={esgotado}
              >
                {esgotado ? 'Esgotado' : 'Adicionar ao carrinho'}
              </motion.button>
            </div>

            <div className="detalhe-trust">
              {produto.freteGratis && (
                <span className="detalhe-trust-item">
                  <IconeCaminhao size={18} /> Frete grátis para esta compra
                </span>
              )}
              {garantia != null && (
                <span className="detalhe-trust-item">
                  <IconeEscudo size={18} /> Garantia de {garantia} meses
                </span>
              )}
              <span className="detalhe-trust-item">
                <IconeDevolucao size={18} /> Devolução grátis em até 7 dias
              </span>
              <span className="detalhe-trust-item">
                <IconeCadeado size={18} /> Pagamento 100% seguro
              </span>
            </div>
          </div>

          {chaves.length > 0 && (
            <div className="detalhe-specs">
              <h2>Especificações</h2>
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
            </div>
          )}
        </div>
      </motion.div>

      {relacionados.length > 0 && (
        <section className="detalhe-relacionados">
          <h2>Você também pode gostar</h2>
          <div className="grade-produtos">
            {relacionados.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
