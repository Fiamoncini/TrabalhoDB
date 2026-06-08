import { describe, it, expect, beforeEach } from 'vitest'
import { criarPedido, listarPedidos } from './pedidosService'

const itens = [
  { id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 2 },
  { id: 'p09', nome: 'Livro', preco: 94.9, imagem: 'l.jpg', quantidade: 1 },
]
const endereco = { rua: 'Rua A', numero: '10', cidade: 'SP', estado: 'SP', cep: '00000-000' }

describe('pedidosService', () => {
  beforeEach(() => localStorage.clear())

  it('cria um pedido com itens, total e status confirmado', async () => {
    const pedido = await criarPedido({ itens, enderecoEntrega: endereco })
    expect(pedido.itens).toHaveLength(2)
    expect(pedido.total).toBeCloseTo(214.7, 2)
    expect(pedido.status).toBe('confirmado')
    expect(pedido.id).toBeTruthy()
    expect(pedido.criadoEm).toBeTruthy()
  })

  it('persiste o pedido no localStorage', async () => {
    await criarPedido({ itens, enderecoEntrega: endereco })
    const salvos = JSON.parse(localStorage.getItem('pedidos'))
    expect(salvos).toHaveLength(1)
  })

  it('lista os pedidos com o mais recente primeiro', async () => {
    const primeiro = await criarPedido({ itens, enderecoEntrega: endereco })
    const segundo = await criarPedido({ itens: [itens[0]], enderecoEntrega: endereco })
    const lista = await listarPedidos()
    expect(lista).toHaveLength(2)
    expect(lista[0].id).toBe(segundo.id)
    expect(lista[1].id).toBe(primeiro.id)
  })

  it('retorna lista vazia quando nao ha pedidos', async () => {
    expect(await listarPedidos()).toEqual([])
  })
})
