import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Colecao de usuarios. A senha NUNCA e guardada em texto puro — so o hash.
const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    senhaHash: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.senhaHash // nunca expor o hash
        return ret
      },
    },
  }
)

// Helper para gerar o hash da senha (usado no cadastro).
usuarioSchema.statics.gerarHash = function (senha) {
  return bcrypt.hash(senha, 10)
}

// Compara uma senha em texto com o hash guardado (usado no login).
usuarioSchema.methods.conferirSenha = function (senha) {
  return bcrypt.compare(senha, this.senhaHash)
}

export default mongoose.model('Usuario', usuarioSchema)
