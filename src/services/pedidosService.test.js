import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../api/client'
import { criarPedido, listarPedidos } from './pedidosService'

vi.mock('../api/client', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

const itens = [
  { id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 2 },
]

describe('pedidosService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('criarPedido posta em /pedidos e devolve o pedido criado', async () => {
    api.post.mockResolvedValue({
      data: { id: 'ped1', itens, total: 119.8, status: 'confirmado', criadoEm: '2024-01-01' },
    })
    const pedido = await criarPedido({ itens })
    expect(api.post).toHaveBeenCalledWith('/pedidos', { itens, enderecoEntrega: undefined })
    expect(pedido.status).toBe('confirmado')
    expect(pedido.id).toBe('ped1')
  })

  it('listarPedidos busca em /pedidos e devolve a lista', async () => {
    api.get.mockResolvedValue({ data: [{ id: 'ped1' }] })
    const lista = await listarPedidos()
    expect(api.get).toHaveBeenCalledWith('/pedidos')
    expect(lista).toHaveLength(1)
  })

  it('listarPedidos devolve lista vazia quando nao ha pedidos', async () => {
    api.get.mockResolvedValue({ data: [] })
    expect(await listarPedidos()).toEqual([])
  })
})
