import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import MeusPedidos from './MeusPedidos'
import { listarPedidos, excluirPedido } from '../services/pedidosService'

vi.mock('../services/pedidosService', () => ({
  listarPedidos: vi.fn(),
  criarPedido: vi.fn(),
  excluirPedido: vi.fn(),
}))

function renderizar() {
  return render(
    <MemoryRouter>
      <MeusPedidos />
    </MemoryRouter>
  )
}

describe('MeusPedidos', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('apos carregar mostra o status e o nome de um item do pedido', async () => {
    listarPedidos.mockResolvedValue([
      {
        id: 'ped-1',
        itens: [{ id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 1 }],
        total: 59.9,
        status: 'confirmado',
        criadoEm: '2024-01-10T12:00:00.000Z',
      },
    ])

    renderizar()

    expect(await screen.findByText(/Camiseta/i)).toBeInTheDocument()
    expect(screen.getByText('confirmado')).toBeInTheDocument()
  })

  it('sem pedidos mostra mensagem de que ainda nao fez pedidos', async () => {
    listarPedidos.mockResolvedValue([])
    renderizar()

    expect(await screen.findByText(/ainda nao fez pedidos/i)).toBeInTheDocument()
  })

  it('exclui um pedido ao clicar em "Excluir pedido"', async () => {
    listarPedidos.mockResolvedValue([
      {
        id: 'ped-1',
        itens: [{ id: 'p04', nome: 'Camiseta', preco: 59.9, imagem: 'c.jpg', quantidade: 1 }],
        total: 59.9,
        status: 'confirmado',
        criadoEm: '2024-01-10T12:00:00.000Z',
      },
    ])
    excluirPedido.mockResolvedValue({ ok: true, id: 'ped-1' })

    renderizar()
    await screen.findByText(/Camiseta/i)

    await userEvent.click(screen.getByRole('button', { name: /excluir pedido/i }))

    expect(excluirPedido).toHaveBeenCalledWith('ped-1')
    await waitFor(() =>
      expect(screen.queryByText(/Camiseta/i)).not.toBeInTheDocument()
    )
  })
})
