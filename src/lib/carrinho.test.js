import { describe, it, expect } from 'vitest'
import {
  adicionarItem,
  atualizarQuantidade,
  removerItem,
  calcularTotal,
  contarItens,
} from './carrinho'

const camiseta = { id: '1', nome: 'Camiseta', preco: 49.9, imagem: 'c.jpg' }
const livro = { id: '2', nome: 'Livro NoSQL', preco: 80, imagem: 'l.jpg' }

describe('adicionarItem', () => {
  it('adiciona um produto novo com quantidade 1 por padrao', () => {
    const carrinho = adicionarItem([], camiseta)
    expect(carrinho).toHaveLength(1)
    expect(carrinho[0]).toMatchObject({ id: '1', nome: 'Camiseta', preco: 49.9, quantidade: 1 })
  })

  it('respeita a quantidade informada', () => {
    const carrinho = adicionarItem([], camiseta, 3)
    expect(carrinho[0].quantidade).toBe(3)
  })

  it('incrementa a quantidade quando o produto ja esta no carrinho', () => {
    let carrinho = adicionarItem([], camiseta, 1)
    carrinho = adicionarItem(carrinho, camiseta, 2)
    expect(carrinho).toHaveLength(1)
    expect(carrinho[0].quantidade).toBe(3)
  })

  it('nao muta o carrinho original (imutabilidade)', () => {
    const original = []
    const novo = adicionarItem(original, camiseta)
    expect(original).toHaveLength(0)
    expect(novo).not.toBe(original)
  })
})

describe('atualizarQuantidade', () => {
  it('define uma nova quantidade para o item', () => {
    const carrinho = atualizarQuantidade(adicionarItem([], camiseta), '1', 5)
    expect(carrinho[0].quantidade).toBe(5)
  })

  it('remove o item quando a quantidade fica <= 0', () => {
    const carrinho = atualizarQuantidade(adicionarItem([], camiseta), '1', 0)
    expect(carrinho).toHaveLength(0)
  })
})

describe('removerItem', () => {
  it('remove o item pelo id', () => {
    let carrinho = adicionarItem([], camiseta)
    carrinho = adicionarItem(carrinho, livro)
    carrinho = removerItem(carrinho, '1')
    expect(carrinho).toHaveLength(1)
    expect(carrinho[0].id).toBe('2')
  })
})

describe('calcularTotal', () => {
  it('soma preco vezes quantidade de todos os itens', () => {
    let carrinho = adicionarItem([], camiseta, 2) // 99.8
    carrinho = adicionarItem(carrinho, livro, 1) // 80
    expect(calcularTotal(carrinho)).toBeCloseTo(179.8, 2)
  })

  it('retorna 0 para carrinho vazio', () => {
    expect(calcularTotal([])).toBe(0)
  })
})

describe('contarItens', () => {
  it('soma as quantidades (para o badge do carrinho)', () => {
    let carrinho = adicionarItem([], camiseta, 2)
    carrinho = adicionarItem(carrinho, livro, 3)
    expect(contarItens(carrinho)).toBe(5)
  })
})
