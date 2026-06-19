import Pedido from '../models/Pedido.js'

// POST /api/pedidos  (protegida)
// body: { itens: [{ id, nome, preco, imagem, quantidade }], enderecoEntrega? }
export async function criar(req, res) {
  const { itens, enderecoEntrega } = req.body || {}

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'O pedido precisa de pelo menos um item.' })
  }

  // O total e calculado no servidor — nao se confia no valor vindo do cliente.
  const total = itens.reduce(
    (soma, i) => soma + Number(i.preco || 0) * Number(i.quantidade || 0),
    0
  )

  const pedido = await Pedido.create({
    usuario: req.usuario.id,
    usuarioNome: req.usuario.nome,
    usuarioEmail: req.usuario.email,
    itens: itens.map((i) => ({
      id: i.id,
      nome: i.nome,
      preco: i.preco,
      imagem: i.imagem,
      quantidade: i.quantidade,
    })),
    total,
    enderecoEntrega,
  })

  res.status(201).json(pedido)
}

// GET /api/pedidos  (protegida) — pedidos do usuario logado, mais recente primeiro.
export async function listar(req, res) {
  const pedidos = await Pedido.find({ usuario: req.usuario.id }).sort({ criadoEm: -1 })
  res.json(pedidos)
}
