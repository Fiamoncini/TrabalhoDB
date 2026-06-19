import Produto, { normalizar } from '../models/Produto.js'

// Mapa criterio -> ordenacao do Mongo. "relevancia" usa a ordem do catalogo.
const ORDENACOES = {
  'menor-preco': { preco: 1 },
  'maior-preco': { preco: -1 },
  nome: { nome: 1 },
}

// GET /api/produtos?categoria=&busca=&ordenar=
export async function listar(req, res) {
  const { categoria, busca, ordenar } = req.query

  const filtro = {}
  if (categoria && categoria !== 'todos') filtro.categoria = categoria
  if (busca && busca.trim()) {
    // Busca no nome normalizado (sem acento, minusculo) -> tolerante a acento.
    filtro.nomeBusca = { $regex: normalizar(busca.trim()), $options: 'i' }
  }

  const ordenacao = ORDENACOES[ordenar] || { ordem: 1 }
  const produtos = await Produto.find(filtro).sort(ordenacao)
  res.json(produtos)
}

// GET /api/produtos/:id
export async function obter(req, res) {
  const produto = await Produto.findById(req.params.id)
  if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado.' })
  res.json(produto)
}
