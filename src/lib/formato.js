const formatadorBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const NBSP = String.fromCharCode(160) // espaco nao-quebravel (U+00A0) inserido pelo Intl
const ESPACO = String.fromCharCode(32) // espaco comum

// Formata um numero como preco em reais: 1234.5 -> "R$ 1.234,50".
// O Intl insere um espaco nao-quebravel; normalizamos para espaco comum.
export function formatarPreco(valor) {
  return formatadorBRL.format(valor ?? 0).split(NBSP).join(ESPACO)
}
