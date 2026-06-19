import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import ProdutoDetalhe from './ProdutoDetalhe'
import { produtos } from '../mocks/produtos'

// A pagina busca o produto na API. Mockamos o servico para devolver o produto
// mock correspondente ao id da rota.
vi.mock('../services/produtosService', () => ({
  obterProduto: vi.fn(async (id) => produtos.find((p) => p.id === id) || null),
  listarProdutos: vi.fn(),
}))

// Pequeno consumidor que expoe a quantidade total do carrinho.
function ContadorCarrinho() {
  const { quantidadeTotal } = useCart()
  return <span data-testid="qt">{quantidadeTotal}</span>
}

function renderizar(rota = '/produto/p01') {
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
    expect(await screen.findByText(/Fone de Ouvido/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*349,90/)).toBeInTheDocument()
  })

  it('mostra ao menos um atributo (chave e valor)', async () => {
    renderizar()
    expect(await screen.findByText('conectividade')).toBeInTheDocument()
    expect(screen.getByText('Bluetooth 5.3')).toBeInTheDocument()
  })

  it('adicionar ao carrinho aumenta a quantidade total de 0 para 1', async () => {
    renderizar()
    await screen.findByText(/Fone de Ouvido/i)

    expect(screen.getByTestId('qt')).toHaveTextContent('0')

    await userEvent.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))

    expect(screen.getByTestId('qt')).toHaveTextContent('1')
  })
})
