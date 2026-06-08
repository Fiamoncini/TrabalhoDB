import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'

const camiseta = { id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg' }
const livro = { id: 'p09', nome: 'Livro', preco: 94.9, imagem: 'l.jpg' }

function montar() {
  return renderHook(() => useCart(), { wrapper: CartProvider })
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('comeca vazio', () => {
    const { result } = montar()
    expect(result.current.itens).toHaveLength(0)
    expect(result.current.quantidadeTotal).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('adiciona um produto ao carrinho', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta))
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.quantidadeTotal).toBe(1)
  })

  it('incrementa a quantidade ao adicionar o mesmo produto', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta))
    act(() => result.current.adicionar(camiseta, 2))
    expect(result.current.itens).toHaveLength(1)
    expect(result.current.quantidadeTotal).toBe(3)
  })

  it('calcula o total corretamente', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta, 2)) // 119.8
    act(() => result.current.adicionar(livro, 1)) // 94.9
    expect(result.current.total).toBeCloseTo(214.7, 2)
  })

  it('atualiza a quantidade de um item', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta))
    act(() => result.current.atualizar('p04', 5))
    expect(result.current.quantidadeTotal).toBe(5)
  })

  it('remove um item', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta))
    act(() => result.current.remover('p04'))
    expect(result.current.itens).toHaveLength(0)
  })

  it('limpa o carrinho', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta))
    act(() => result.current.adicionar(livro))
    act(() => result.current.limpar())
    expect(result.current.itens).toHaveLength(0)
  })

  it('persiste o carrinho no localStorage', () => {
    const { result } = montar()
    act(() => result.current.adicionar(camiseta, 2))
    const salvo = JSON.parse(localStorage.getItem('carrinho'))
    expect(salvo).toHaveLength(1)
    expect(salvo[0]).toMatchObject({ id: 'p04', quantidade: 2 })
  })

  it('carrega o carrinho salvo do localStorage ao iniciar', () => {
    localStorage.setItem(
      'carrinho',
      JSON.stringify([{ id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 4 }])
    )
    const { result } = montar()
    expect(result.current.quantidadeTotal).toBe(4)
  })
})
