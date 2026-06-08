import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import ProdutoCard from './ProdutoCard'

const produto = {
  id: 'p04',
  nome: 'Camiseta Premium',
  preco: 59.9,
  precoAntigo: 89.9,
  imagem: 'c.jpg',
  categoria: 'roupas',
  avaliacao: 4.6,
  freteGratis: true,
}

function ContadorCarrinho() {
  const { quantidadeTotal } = useCart()
  return <div data-testid="contador">{quantidadeTotal}</div>
}

function renderizar(p = produto) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProdutoCard produto={p} />
        <ContadorCarrinho />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('ProdutoCard', () => {
  beforeEach(() => localStorage.clear())

  it('mostra o nome do produto', () => {
    renderizar()
    expect(screen.getByText('Camiseta Premium')).toBeInTheDocument()
  })

  it('mostra o preco formatado em reais', () => {
    renderizar()
    expect(screen.getByText('R$ 59,90')).toBeInTheDocument()
  })

  it('adiciona ao carrinho ao clicar no botao', async () => {
    renderizar()
    expect(screen.getByTestId('contador')).toHaveTextContent('0')
    await userEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    expect(screen.getByTestId('contador')).toHaveTextContent('1')
  })

  it('exibe o selo de frete gratis quando aplicavel', () => {
    renderizar()
    expect(screen.getByText(/frete gr/i)).toBeInTheDocument()
  })

  it('liga o nome a pagina de detalhe do produto', () => {
    renderizar()
    const titulo = screen.getByRole('heading', { name: /camiseta premium/i })
    const link = within(titulo).getByRole('link')
    expect(link).toHaveAttribute('href', '/produto/p04')
  })
})
