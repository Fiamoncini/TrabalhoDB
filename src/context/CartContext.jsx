import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  adicionarItem,
  atualizarQuantidade,
  removerItem,
  calcularTotal,
  contarItens,
} from '../lib/carrinho'

const CartContext = createContext(null)

const CHAVE = 'carrinho'

function carregarInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? JSON.parse(salvo) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [itens, setItens] = useState(carregarInicial)

  // Persiste sempre que o carrinho muda.
  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(itens))
  }, [itens])

  const valor = useMemo(() => {
    return {
      itens,
      total: calcularTotal(itens),
      quantidadeTotal: contarItens(itens),
      adicionar: (produto, quantidade = 1) =>
        setItens((atual) => adicionarItem(atual, produto, quantidade)),
      atualizar: (id, quantidade) =>
        setItens((atual) => atualizarQuantidade(atual, id, quantidade)),
      remover: (id) => setItens((atual) => removerItem(atual, id)),
      limpar: () => setItens([]),
    }
  }, [itens])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de <CartProvider>')
  }
  return ctx
}
