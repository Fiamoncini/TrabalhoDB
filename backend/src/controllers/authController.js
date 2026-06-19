import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

// Gera um JWT com os dados basicos do usuario.
function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, email: usuario.email, nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Formato de resposta que o frontend espera: { token, usuario: {...} }.
function resposta(usuario) {
  return {
    token: gerarToken(usuario),
    usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
  }
}

// POST /api/auth/register  { nome, email, senha }
export async function registrar(req, res) {
  const { nome, email, senha } = req.body || {}
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, email e senha.' })
  }

  const existe = await Usuario.findOne({ email: email.toLowerCase() })
  if (existe) {
    return res.status(409).json({ erro: 'Ja existe uma conta com esse email.' })
  }

  const senhaHash = await Usuario.gerarHash(senha)
  const usuario = await Usuario.create({ nome, email, senhaHash })
  res.status(201).json(resposta(usuario))
}

// POST /api/auth/login  { email, senha }
export async function login(req, res) {
  const { email, senha } = req.body || {}
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha.' })
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase() })
  if (!usuario || !(await usuario.conferirSenha(senha))) {
    return res.status(401).json({ erro: 'Email ou senha invalidos.' })
  }

  res.json(resposta(usuario))
}
