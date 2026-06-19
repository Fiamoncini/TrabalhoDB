// Envolve um handler assincrono e encaminha qualquer rejeicao para o
// middleware central de erros (no Express 4 isso nao acontece sozinho).
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
