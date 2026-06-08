import { calcularTotal } from '../lib/carrinho'

// Servico de pedidos MOCK (persiste no localStorage). Para usar a API real,
// troque por api.post('/pedidos') e api.get('/pedidos').

const CHAVE = 'pedidos'
const ATRASO = import.meta.env.VITEST ? 0 : 250
const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function ler() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? JSON.parse(salvo) : []
  } catch {
    return []
  }
}

let contador = 0

export async function criarPedido({ itens, enderecoEntrega }) {
  await espera(ATRASO)
  contador += 1
  const pedido = {
    id: `ped-${Date.now()}-${contador}`,
    itens: itens.map((i) => ({
      id: i.id,
      nome: i.nome,
      preco: i.preco,
      imagem: i.imagem,
      quantidade: i.quantidade,
    })),
    total: calcularTotal(itens),
    status: 'confirmado',
    enderecoEntrega,
    criadoEm: new Date().toISOString(),
  }
  const lista = [pedido, ...ler()]
  localStorage.setItem(CHAVE, JSON.stringify(lista))
  return pedido
}

export async function listarPedidos() {
  await espera(ATRASO)
  return ler()
}
