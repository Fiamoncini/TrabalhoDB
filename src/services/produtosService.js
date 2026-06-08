import { produtos } from '../mocks/produtos'
import { filtrarProdutos, ordenarProdutos } from '../lib/filtros'

// Camada de servico (a "costura" da fonte de dados).
// Hoje usa os dados mock; para ligar na API real, basta trocar o corpo destas
// funcoes por chamadas axios ao backend (ex.: api.get('/produtos')).

// Pequeno atraso para simular rede e exibir os skeletons. Zero durante os testes.
const ATRASO = import.meta.env.VITEST ? 0 : 320
const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function listarProdutos({ categoria, busca, ordenar } = {}) {
  await espera(ATRASO)
  const filtrados = filtrarProdutos(produtos, { categoria, busca })
  return ordenarProdutos(filtrados, ordenar || 'relevancia')
}

export async function obterProduto(id) {
  await espera(ATRASO)
  return produtos.find((produto) => produto.id === id) || null
}
