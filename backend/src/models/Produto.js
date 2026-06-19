import mongoose from 'mongoose'

// Normaliza texto (remove acentos + minusculas) para busca tolerante a acento,
// igual a logica do frontend (src/lib/filtros.js). U+0300..U+036F sao as
// marcas de acento combinantes geradas pelo normalize('NFD').
export function normalizar(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const produtoSchema = new mongoose.Schema(
  {
    // Usamos o id "slug" do catalogo (ex.: 'p01') como _id, para casar com as
    // rotas/links que o frontend ja usa (/produto/p01).
    _id: { type: String, required: true },
    nome: { type: String, required: true },
    nomeBusca: { type: String, index: true }, // nome normalizado (busca)
    descricao: String,
    preco: { type: Number, required: true },
    precoAntigo: Number,
    categoria: { type: String, required: true, index: true },
    estoque: { type: Number, default: 0 },
    imagem: String,
    freteGratis: { type: Boolean, default: false },
    avaliacao: Number,
    vendidos: { type: Number, default: 0 },
    // O destaque do NoSQL: schema flexivel, muda conforme a categoria.
    atributos: { type: mongoose.Schema.Types.Mixed, default: {} },
    ordem: { type: Number, default: 0 }, // preserva a ordem de "relevancia"
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.nomeBusca
        delete ret.ordem
        return ret
      },
    },
  }
)

// Mantem nomeBusca em sincronia com o nome ao salvar pelo .save().
produtoSchema.pre('save', function (next) {
  if (this.isModified('nome')) this.nomeBusca = normalizar(this.nome)
  next()
})

export default mongoose.model('Produto', produtoSchema)
