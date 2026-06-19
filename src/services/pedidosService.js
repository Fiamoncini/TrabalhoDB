import api from '../api/client'

// Servico de pedidos — agora usa a API real (rotas protegidas por token).
// O token Bearer e injetado automaticamente pelo interceptor em api/client.js.

export async function criarPedido({ itens, enderecoEntrega }) {
  const { data } = await api.post('/pedidos', { itens, enderecoEntrega })
  return data
}

export async function listarPedidos() {
  const { data } = await api.get('/pedidos')
  return data
}
