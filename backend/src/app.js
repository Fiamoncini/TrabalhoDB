import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import produtosRoutes from './routes/produtos.js'
import pedidosRoutes from './routes/pedidos.js'
import { naoEncontrado, tratarErros } from './middleware/erros.js'

// Monta o app Express (separado do server.js para facilitar testes).
export function criarApp() {
  const app = express()

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
  app.use(express.json())

  // Healthcheck (util para o Render saber que o servico esta de pe).
  app.get('/', (req, res) => res.json({ ok: true, api: 'Mercado NoSQL', versao: 1 }))
  app.get('/api/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRoutes)
  app.use('/api/produtos', produtosRoutes)
  app.use('/api/pedidos', pedidosRoutes)

  app.use(naoEncontrado)
  app.use(tratarErros)

  return app
}
