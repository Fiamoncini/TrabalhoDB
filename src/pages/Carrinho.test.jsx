import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import Carrinho from './Carrinho'
import { criarPedido } from '../services/pedidosService'

// Finalizar pedido chama a API. Mockamos o servico.
vi.mock('../services/pedidosService', () => ({
  criarPedido: vi.fn(async () => ({ id: 'ped1', status: 'confirmado' })),
  listarPedidos: vi.fn(),
}))

function semearCarrinho() {
  localStorage.setItem(
    'carrinho',
    JSON.stringify([
      { id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 2 },
    ])
  )
}

function renderizar() {
  return render(
    <MemoryRouter initialEntries={['/carrinho']}>
      <CartProvider>
        <Carrinho />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('Carrinho', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('mostra os itens do carrinho e o total', () => {
    semearCarrinho()
    renderizar()

    expect(screen.getByText('Camiseta')).toBeInTheDocument()
    // 2 x 59,90 = 119,80 (subtotal do item e total do resumo)
    expect(screen.getAllByText(/119,80/).length).toBeGreaterThan(0)
  })

  it('clicar em "+" aumenta a quantidade exibida', async () => {
    semearCarrinho()
    renderizar()

    expect(screen.getByText('2')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /aumentar quantidade/i }))
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('mostra mensagem quando o carrinho esta vazio', () => {
    renderizar()
    expect(screen.getByText(/carrinho esta vazio/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ver produtos/i })).toBeInTheDocument()
  })

  it('finalizar pedido chama a API com os itens e limpa o carrinho', async () => {
    semearCarrinho()
    renderizar()

    await userEvent.click(screen.getByRole('button', { name: /finalizar pedido/i }))

    await waitFor(() => expect(criarPedido).toHaveBeenCalledTimes(1))
    expect(criarPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        itens: expect.arrayContaining([expect.objectContaining({ id: 'p04', quantidade: 2 })]),
      })
    )

    await waitFor(() => {
      const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]')
      expect(carrinho).toHaveLength(0)
    })
  })
})
