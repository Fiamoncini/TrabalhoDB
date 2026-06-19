import 'dotenv/config'
import mongoose from 'mongoose'
import { conectarBanco } from '../config/db.js'
import Produto, { normalizar } from '../models/Produto.js'
import { produtos } from './produtos.seed.js'

// Popula a colecao de produtos. Apaga o que existe e insere o catalogo do zero.
// Uso: npm run seed
async function semear() {
  await conectarBanco(process.env.MONGODB_URI)

  await Produto.deleteMany({})

  const docs = produtos.map((p, i) => ({
    _id: p.id,
    nome: p.nome,
    nomeBusca: normalizar(p.nome),
    descricao: p.descricao,
    preco: p.preco,
    precoAntigo: p.precoAntigo,
    categoria: p.categoria,
    estoque: p.estoque,
    imagem: p.imagem,
    freteGratis: p.freteGratis,
    avaliacao: p.avaliacao,
    vendidos: p.vendidos,
    atributos: p.atributos,
    ordem: i, // mantem a ordem do catalogo para "relevancia"
  }))

  await Produto.insertMany(docs)
  console.log(`✅ Seed concluido: ${docs.length} produtos inseridos.`)

  await mongoose.disconnect()
  process.exit(0)
}

semear().catch((err) => {
  console.error('❌ Erro no seed:', err.message)
  process.exit(1)
})
