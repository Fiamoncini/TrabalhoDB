import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import ProdutoCard from '../components/ProdutoCard'
import { listarProdutos } from '../services/produtosService'
import { categorias, produtos as todosProdutos } from '../mocks/produtos'
import { formatarPreco } from '../lib/formato'

const PRECO_MAX = Math.ceil(Math.max(...todosProdutos.map((p) => p.preco)) / 100) * 100

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}
const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoria = searchParams.get('categoria') || ''
  const busca = searchParams.get('busca') || ''
  const ordenar = searchParams.get('ordenar') || 'relevancia'
  const precoMax = searchParams.get('precoMax') ? Number(searchParams.get('precoMax')) : null

  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    listarProdutos({ categoria, busca, ordenar }).then((lista) => {
      if (ativo) {
        setProdutos(lista)
        setCarregando(false)
      }
    })
    return () => {
      ativo = false
    }
  }, [categoria, busca, ordenar])

  const visiveis = useMemo(
    () => (precoMax != null ? produtos.filter((p) => p.preco <= precoMax) : produtos),
    [produtos, precoMax]
  )

  function atualizarParam(chave, valor) {
    setSearchParams((prev) => {
      const novo = new URLSearchParams(prev)
      if (valor === '' || valor == null) novo.delete(chave)
      else novo.set(chave, String(valor))
      return novo
    })
  }

  const nomeCategoria = categorias.find((c) => c.id === categoria)?.nome
  const titulo = busca
    ? `Resultados para "${busca}"`
    : nomeCategoria || 'Todos os produtos'

  return (
    <div className="container catalogo">
      <aside className="filtros" aria-label="Filtros">
        <div className="filtros-grupo">
          <h3>Categorias</h3>
          <button
            className={`filtro-opcao ${!categoria ? 'filtro-opcao-ativo' : ''}`}
            onClick={() => atualizarParam('categoria', '')}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              className={`filtro-opcao ${categoria === c.id ? 'filtro-opcao-ativo' : ''}`}
              onClick={() => atualizarParam('categoria', c.id)}
            >
              {c.nome}
            </button>
          ))}
        </div>

        <div className="filtros-grupo">
          <h3>Preço até</h3>
          <input
            className="filtro-faixa"
            type="range"
            min="0"
            max={PRECO_MAX}
            step="50"
            value={precoMax ?? PRECO_MAX}
            onChange={(e) => {
              const v = Number(e.target.value)
              atualizarParam('precoMax', v >= PRECO_MAX ? '' : v)
            }}
            aria-label="Preço máximo"
          />
          <div style={{ fontWeight: 700, marginTop: 6 }}>
            {formatarPreco(precoMax ?? PRECO_MAX)}
          </div>
        </div>
      </aside>

      <div className="catalogo-conteudo">
        <div className="catalogo-topo">
          <div>
            <h1>{titulo}</h1>
            <p className="catalogo-resultado">
              {carregando ? 'Carregando...' : `${visiveis.length} resultado(s)`}
            </p>
          </div>
          <div className="ordenar">
            <label htmlFor="ordenar">Ordenar por</label>
            <select
              id="ordenar"
              value={ordenar}
              onChange={(e) => atualizarParam('ordenar', e.target.value)}
            >
              <option value="relevancia">Mais relevantes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="nome">Nome (A-Z)</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="grade-produtos">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : visiveis.length === 0 ? (
          <div className="vazio">
            <div className="vazio-emoji">🔍</div>
            <h2>Nenhum produto encontrado</h2>
            <p>Tente ajustar a busca ou os filtros.</p>
          </div>
        ) : (
          <motion.div
            key={`${categoria}-${busca}-${ordenar}-${precoMax}`}
            className="grade-produtos"
            variants={containerAnim}
            initial="hidden"
            animate="visible"
          >
            {visiveis.map((produto) => (
              <motion.div key={produto.id} variants={itemAnim}>
                <ProdutoCard produto={produto} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
