import { describe, it, expect } from 'vitest'
import { listarProdutos, obterProduto } from './produtosService'
import { produtos } from '../mocks/produtos'

describe('listarProdutos', () => {
  it('retorna todos os produtos quando nao ha filtros', async () => {
    const lista = await listarProdutos()
    expect(lista).toHaveLength(produtos.length)
  })

  it('filtra por categoria', async () => {
    const lista = await listarProdutos({ categoria: 'livros' })
    expect(lista.length).toBeGreaterThan(0)
    expect(lista.every((p) => p.categoria === 'livros')).toBe(true)
  })

  it('filtra por termo de busca no nome', async () => {
    const lista = await listarProdutos({ busca: 'fone' })
    expect(lista.every((p) => p.nome.toLowerCase().includes('fone'))).toBe(true)
    expect(lista.length).toBeGreaterThan(0)
  })

  it('ordena por maior preco', async () => {
    const lista = await listarProdutos({ ordenar: 'maior-preco' })
    for (let i = 1; i < lista.length; i++) {
      expect(lista[i - 1].preco).toBeGreaterThanOrEqual(lista[i].preco)
    }
  })
})

describe('obterProduto', () => {
  it('retorna o produto pelo id', async () => {
    const produto = await obterProduto('p09')
    expect(produto).toBeTruthy()
    expect(produto.id).toBe('p09')
  })

  it('retorna null para id inexistente', async () => {
    const produto = await obterProduto('nao-existe')
    expect(produto).toBeNull()
  })
})
