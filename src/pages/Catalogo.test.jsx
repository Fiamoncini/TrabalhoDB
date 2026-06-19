import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import Catalogo from './Catalogo'
import { produtos } from '../mocks/produtos'
import { filtrarProdutos, ordenarProdutos } from '../lib/filtros'

// O catalogo busca da API. Mockamos o servico para devolver os dados mock ja
// filtrados/ordenados (mesma semantica do backend), sem precisar de rede.
vi.mock('../services/produtosService', () => ({
  listarProdutos: vi.fn(async ({ categoria, busca, ordenar } = {}) =>
    ordenarProdutos(filtrarProdutos(produtos, { categoria, busca }), ordenar || 'relevancia')
  ),
  obterProduto: vi.fn(),
}))

const totalEletronicos = produtos.filter((p) => p.categoria === 'eletronicos').length

function renderizar(rota = '/') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <CartProvider>
        <Catalogo />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('Catalogo', () => {
  beforeEach(() => localStorage.clear())

  it('mostra todos os produtos depois de carregar', async () => {
    renderizar()
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(produtos.length)
  })

  it('filtra por categoria vinda da query string', async () => {
    renderizar('/?categoria=eletronicos')
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(totalEletronicos)
  })

  it('filtra por termo de busca vindo da query string', async () => {
    renderizar('/?busca=fone')
    await screen.findAllByRole('article')
    expect(screen.getByText(/Fone de Ouvido/i)).toBeInTheDocument()
    expect(screen.queryByText(/Camiseta Basica/i)).not.toBeInTheDocument()
  })

  it('atualiza a lista ao clicar num filtro de categoria', async () => {
    renderizar()
    await screen.findAllByRole('article')
    const sidebar = screen.getByRole('complementary')
    await userEvent.click(within(sidebar).getByRole('button', { name: /^eletronicos$/i }))
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(totalEletronicos)
  })

  it('filtra por preco maximo vindo da query string', async () => {
    renderizar('/?precoMax=100')
    const cards = await screen.findAllByRole('article')
    const esperado = produtos.filter((p) => p.preco <= 100).length
    expect(cards).toHaveLength(esperado)
  })

  it('mostra estado vazio quando nada corresponde', async () => {
    renderizar('/?busca=zzzznaoexiste')
    expect(await screen.findByText(/nenhum produto/i)).toBeInTheDocument()
  })
})
