import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import ProdutoDetalhe from './ProdutoDetalhe'

// Pequeno consumidor que expoe a quantidade total do carrinho.
function ContadorCarrinho() {
  const { quantidadeTotal } = useCart()
  return <span data-testid="qt">{quantidadeTotal}</span>
}

function renderizar(rota = '/produto/p09') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <CartProvider>
        <ContadorCarrinho />
        <Routes>
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )
}

describe('ProdutoDetalhe', () => {
  beforeEach(() => localStorage.clear())

  it('mostra o nome e o preco do produto depois de carregar', async () => {
    renderizar()
    expect(await screen.findByText(/NoSQL na Pratica/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*94,90/)).toBeInTheDocument()
  })

  it('mostra ao menos um atributo (chave e valor)', async () => {
    renderizar()
    expect(await screen.findByText('autor')).toBeInTheDocument()
    expect(screen.getByText('A. Pereira')).toBeInTheDocument()
  })

  it('adicionar ao carrinho aumenta a quantidade total de 0 para 1', async () => {
    renderizar()
    await screen.findByText(/NoSQL na Pratica/i)

    expect(screen.getByTestId('qt')).toHaveTextContent('0')

    await userEvent.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))

    expect(screen.getByTestId('qt')).toHaveTextContent('1')
  })
})
