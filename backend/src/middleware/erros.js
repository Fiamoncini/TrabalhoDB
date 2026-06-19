// 404 para rotas que nao existem.
export function naoEncontrado(req, res) {
  res.status(404).json({ erro: `Rota nao encontrada: ${req.method} ${req.originalUrl}` })
}

// Handler central de erros. Captura tudo que cair no next(err).
// eslint-disable-next-line no-unused-vars
export function tratarErros(err, req, res, _next) {
  console.error(err)

  // Erro de validacao do Mongoose -> 400
  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message })
  }
  // Email duplicado (indice unico) -> 409
  if (err.code === 11000) {
    return res.status(409).json({ erro: 'Registro duplicado.' })
  }

  const status = err.status || 500
  res.status(status).json({ erro: err.message || 'Erro interno do servidor.' })
}
