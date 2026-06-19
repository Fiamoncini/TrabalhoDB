import 'dotenv/config'
import { criarApp } from './app.js'
import { conectarBanco } from './config/db.js'

const PORT = process.env.PORT || 5000

// Conecta no banco e so entao sobe o servidor.
async function iniciar() {
  try {
    await conectarBanco(process.env.MONGODB_URI)
    const app = criarApp()
    app.listen(PORT, () => {
      console.log(`🚀 API Mercado NoSQL rodando em http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Falha ao iniciar a API:', err.message)
    process.exit(1)
  }
}

iniciar()
