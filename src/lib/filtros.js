// Remove acentos (marcas combinantes U+0300..U+036F) sem usar escapes Unicode
// literais no fonte, normalizando para minusculas — para busca tolerante a acento.
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0)
      return code < 0x300 || code > 0x36f
    })
    .join('')
    .toLowerCase()
}

// Filtra a lista por categoria, termo de busca (nome) e preco maximo.
// Sempre devolve um novo array (filter), sem mutar a entrada.
export function filtrarProdutos(produtos, { categoria, busca, precoMax } = {}) {
  return produtos.filter((produto) => {
    if (categoria && categoria !== 'todos' && produto.categoria !== categoria) {
      return false
    }
    if (busca && busca.trim()) {
      if (!normalizar(produto.nome).includes(normalizar(busca.trim()))) {
        return false
      }
    }
    if (precoMax != null && produto.preco > precoMax) {
      return false
    }
    return true
  })
}

// Ordena uma copia da lista conforme o criterio escolhido.
export function ordenarProdutos(produtos, criterio) {
  const copia = [...produtos]
  switch (criterio) {
    case 'menor-preco':
      return copia.sort((a, b) => a.preco - b.preco)
    case 'maior-preco':
      return copia.sort((a, b) => b.preco - a.preco)
    case 'nome':
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    default:
      return copia // 'relevancia': mantem a ordem original
  }
}
