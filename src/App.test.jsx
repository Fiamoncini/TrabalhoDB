import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App'
import { produtos } from './mocks/produtos'

// A home renderiza o catalogo, que busca da API. Mockamos o servico.
vi.mock('./services/produtosService', () => ({
  listarProdutos: vi.fn(async () => produtos),
  obterProduto: vi.fn(async (id) => produtos.find((p) => p.id === id) || null),
}))

function renderizar(rota = '/') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('App (integracao)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renderiza a logo e o catalogo na home', async () => {
    renderizar('/')
    expect(screen.getByRole('link', { name: /mercado/i })).toBeInTheDocument()
    const cards = await screen.findAllByRole('article')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('redireciona rota protegida para login quando deslogado', async () => {
    renderizar('/carrinho')
    // ProtectedRoute -> Login: o campo de email do login aparece
    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument()
  })
})
