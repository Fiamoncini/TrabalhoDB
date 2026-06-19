import jwt from 'jsonwebtoken'

// Protege rotas: exige um header "Authorization: Bearer <token>" valido.
// Coloca os dados do usuario logado em req.usuario.
export function autenticar(req, res, next) {
  const header = req.headers.authorization || ''
  const [tipo, token] = header.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token nao fornecido.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = { id: payload.id, email: payload.email, nome: payload.nome }
    next()
  } catch {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' })
  }
}
