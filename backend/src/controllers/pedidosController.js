import mongoose from 'mongoose'
import Pedido from '../models/Pedido.js'
import Produto from '../models/Produto.js'

// POST /api/pedidos  (protegida)
// body: { itens: [{ id, nome, preco, imagem, quantidade }], enderecoEntrega? }
export async function criar(req, res) {
  const { itens, enderecoEntrega } = req.body || {}

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'O pedido precisa de pelo menos um item.' })
  }

  // Valida o estoque ANTES de criar o pedido, consultando os produtos reais no
  // banco (nao se confia nos dados vindos do cliente). Se faltar, nada e gravado.
  const ids = itens.map((i) => i.id)
  const produtos = await Produto.find({ _id: { $in: ids } })
  const porId = new Map(produtos.map((p) => [p._id, p]))

  for (const item of itens) {
    const produto = porId.get(item.id)
    const qtd = Number(item.quantidade || 0)
    if (!produto) {
      return res.status(400).json({ erro: `Produto "${item.nome || item.id}" nao encontrado.` })
    }
    if (qtd <= 0) {
      return res.status(400).json({ erro: `Quantidade invalida para "${produto.nome}".` })
    }
    if (produto.estoque < qtd) {
      return res.status(409).json({
        erro: `Estoque insuficiente para "${produto.nome}" (restam ${produto.estoque}).`,
      })
    }
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

  // Baixa o estoque de cada produto comprado (operacao atomica por item).
  await Promise.all(
    itens.map((i) =>
      Produto.updateOne({ _id: i.id }, { $inc: { estoque: -Number(i.quantidade) } })
    )
  )

  res.status(201).json(pedido)
}

// GET /api/pedidos  (protegida) — pedidos do usuario logado, mais recente primeiro.
export async function listar(req, res) {
  const pedidos = await Pedido.find({ usuario: req.usuario.id }).sort({ criadoEm: -1 })
  res.json(pedidos)
}

// DELETE /api/pedidos/:id  (protegida) — cancela um pedido do proprio usuario e
// devolve os itens ao estoque (o oposto do que a criacao faz).
export async function excluir(req, res) {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ erro: 'Pedido nao encontrado.' })
  }

  // So permite excluir um pedido que pertence ao usuario logado.
  const pedido = await Pedido.findOne({ _id: id, usuario: req.usuario.id })
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido nao encontrado.' })
  }

  // Repoe o estoque dos itens (cancelou -> volta pro estoque).
  await Promise.all(
    pedido.itens.map((i) =>
      Produto.updateOne({ _id: i.id }, { $inc: { estoque: Number(i.quantidade) || 0 } })
    )
  )

  await pedido.deleteOne()
  res.json({ ok: true, id })
}
