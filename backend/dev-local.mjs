// Roda a API localmente com um MongoDB EM MEMORIA (efemero) — util para testar
// sem instalar o Mongo nem configurar o Atlas. Os dados somem ao encerrar.
// Uso: node dev-local.mjs   (precisa de: npm install --no-save mongodb-memory-server)
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = await MongoMemoryServer.create()
process.env.MONGODB_URI = mongod.getUri('mercado_nosql')
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-local'
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
process.env.PORT = process.env.PORT || '5000'

const { conectarBanco } = await import('./src/config/db.js')
const { default: Produto, normalizar } = await import('./src/models/Produto.js')
const { produtos } = await import('./src/seed/produtos.seed.js')
const { criarApp } = await import('./src/app.js')

await conectarBanco(process.env.MONGODB_URI)

// seed dos produtos
await Produto.deleteMany({})
await Produto.insertMany(
  produtos.map((p, i) => ({ _id: p.id, ...p, id: undefined, nomeBusca: normalizar(p.nome), ordem: i }))
)
console.log(`✅ Seed: ${produtos.length} produtos (MongoDB em memoria)`)

const app = criarApp()
app.listen(process.env.PORT, () =>
  console.log(`🚀 API (dev/mem) em http://localhost:${process.env.PORT}`)
)

const stop = async () => {
  try { await mongod.stop() } catch {}
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
