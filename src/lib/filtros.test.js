import { describe, it, expect } from 'vitest'
import { filtrarProdutos, ordenarProdutos } from './filtros'

const produtos = [
  { id: '1', nome: 'Camiseta Preta', categoria: 'roupas', preco: 49.9 },
  { id: '2', nome: 'Livro NoSQL', categoria: 'livros', preco: 80 },
  { id: '3', nome: 'Fone Bluetooth', categoria: 'eletronicos', preco: 199 },
  { id: '4', nome: 'Camisa Social', categoria: 'roupas', preco: 120 },
  { id: '5', nome: 'Tenis Esportivo', categoria: 'calcados', preco: 259.9 },
]

const ids = (lista) => lista.map((p) => p.id)

describe('filtrarProdutos', () => {
  it('sem filtros retorna todos os produtos', () => {
    expect(filtrarProdutos(produtos, {})).toHaveLength(5)
  })

  it('filtra por categoria', () => {
    expect(ids(filtrarProdutos(produtos, { categoria: 'roupas' }))).toEqual(['1', '4'])
  })

  it('ignora categoria vazia ou "todos"', () => {
    expect(filtrarProdutos(produtos, { categoria: '' })).toHaveLength(5)
    expect(filtrarProdutos(produtos, { categoria: 'todos' })).toHaveLength(5)
  })

  it('busca por nome sem diferenciar maiusculas/minusculas', () => {
    expect(ids(filtrarProdutos(produtos, { busca: 'CAMIS' }))).toEqual(['1', '4'])
  })

  it('busca ignorando acentos', () => {
    expect(ids(filtrarProdutos(produtos, { busca: 'tênis' }))).toEqual(['5'])
  })

  it('filtra por preco maximo', () => {
    expect(ids(filtrarProdutos(produtos, { precoMax: 100 }))).toEqual(['1', '2'])
  })

  it('combina categoria e busca', () => {
    expect(ids(filtrarProdutos(produtos, { categoria: 'roupas', busca: 'social' }))).toEqual(['4'])
  })

  it('nao muta o array original', () => {
    const copia = [...produtos]
    filtrarProdutos(produtos, { categoria: 'roupas' })
    expect(produtos).toEqual(copia)
  })
})

describe('ordenarProdutos', () => {
  it('ordena por menor preco', () => {
    expect(ids(ordenarProdutos(produtos, 'menor-preco'))).toEqual(['1', '2', '4', '3', '5'])
  })

  it('ordena por maior preco', () => {
    expect(ids(ordenarProdutos(produtos, 'maior-preco'))).toEqual(['5', '3', '4', '2', '1'])
  })

  it('ordena por nome (A-Z)', () => {
    expect(ids(ordenarProdutos(produtos, 'nome'))).toEqual(['4', '1', '3', '2', '5'])
  })

  it('com criterio relevancia mantem a ordem original', () => {
    expect(ids(ordenarProdutos(produtos, 'relevancia'))).toEqual(['1', '2', '3', '4', '5'])
  })

  it('nao muta o array original', () => {
    const copia = [...produtos]
    ordenarProdutos(produtos, 'maior-preco')
    expect(produtos).toEqual(copia)
  })
})
