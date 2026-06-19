import api from '../api/client'

// Camada de servico de produtos — agora conversa com a API real.
// A filtragem/ordenacao (categoria, busca, ordenar) acontece no backend.

export async function listarProdutos({ categoria, busca, ordenar } = {}) {
  const params = {}
  if (categoria) params.categoria = categoria
  if (busca) params.busca = busca
  if (ordenar) params.ordenar = ordenar

  const { data } = await api.get('/produtos', { params })
  return data
}

export async function obterProduto(id) {
  try {
    const { data } = await api.get(`/produtos/${id}`)
    return data
  } catch (err) {
    // Produto inexistente -> o backend responde 404; aqui devolvemos null
    // para a pagina mostrar o estado "produto nao encontrado".
    if (err.response && err.response.status === 404) return null
    throw err
  }
}
