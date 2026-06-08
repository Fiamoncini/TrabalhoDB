import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App'

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
  beforeEach(() => localStorage.clear())

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
