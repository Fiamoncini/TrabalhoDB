import mongoose from 'mongoose'

// Item do pedido: uma "foto" do produto no momento da compra (nao referencia,
// porque preco/nome podem mudar depois e o pedido deve preservar o historico).
const itemSchema = new mongoose.Schema(
  {
    id: String, // id (slug) do produto
    nome: String,
    preco: Number,
    imagem: String,
    quantidade: Number,
  },
  { _id: false }
)

const pedidoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
    itens: { type: [itemSchema], default: [] },
    total: { type: Number, required: true },
    status: { type: String, default: 'confirmado' },
    enderecoEntrega: { type: mongoose.Schema.Types.Mixed }, // opcional
    criadoEm: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.usuario // nao expor o dono do pedido no JSON
        return ret
      },
    },
  }
)

export default mongoose.model('Pedido', pedidoSchema)
