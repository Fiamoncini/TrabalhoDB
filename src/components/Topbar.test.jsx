import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import Topbar from './Topbar'

function LocalAtual() {
  const loc = useLocation()
  return <div data-testid="local">{loc.pathname + loc.search}</div>
}

function renderizar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Topbar />
          <LocalAtual />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Topbar', () => {
  beforeEach(() => localStorage.clear())

  it('mostra o link de entrar quando deslogado', () => {
    renderizar()
    expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument()
  })

  it('busca navega para a home com o termo na query string', async () => {
    renderizar()
    const campo = screen.getByRole('searchbox')
    await userEvent.type(campo, 'fone{enter}')
    expect(screen.getByTestId('local')).toHaveTextContent('/?busca=fone')
  })

  it('tem um link para o carrinho', () => {
    renderizar()
    expect(screen.getByRole('link', { name: /carrinho/i })).toBeInTheDocument()
  })
})
