// Logica pura e imutavel do carrinho. Cada funcao recebe o carrinho atual
// e devolve um NOVO array, sem mutar o original (facilita uso com React state).

// Adiciona um produto; se ja existir, soma a quantidade.
export function adicionarItem(carrinho, produto, quantidade = 1) {
  const existente = carrinho.find((item) => item.id === produto.id)
  if (existente) {
    return carrinho.map((item) =>
      item.id === produto.id
        ? { ...item, quantidade: item.quantidade + quantidade }
        : item
    )
  }
  return [
    ...carrinho,
    {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade,
    },
  ]
}

// Define a quantidade de um item; se <= 0, remove o item.
export function atualizarQuantidade(carrinho, id, quantidade) {
  if (quantidade <= 0) {
    return removerItem(carrinho, id)
  }
  return carrinho.map((item) =>
    item.id === id ? { ...item, quantidade } : item
  )
}

// Remove um item pelo id.
export function removerItem(carrinho, id) {
  return carrinho.filter((item) => item.id !== id)
}

// Soma preco * quantidade de todos os itens.
export function calcularTotal(carrinho) {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0)
}

// Soma as quantidades (numero de unidades no carrinho).
export function contarItens(carrinho) {
  return carrinho.reduce((soma, item) => soma + item.quantidade, 0)
}
