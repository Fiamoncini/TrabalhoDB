import mongoose from 'mongoose'

// Conecta no MongoDB usando a URI do ambiente. Lanca erro se nao houver URI,
// porque sem banco a API nao tem como funcionar.
export async function conectarBanco(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI nao definida. Copie o .env.example para .env e configure.')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('✅ MongoDB conectado')
}
