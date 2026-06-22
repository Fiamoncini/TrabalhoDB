import { Router } from 'express'
import { autenticar } from '../middleware/auth.js'
import { criar, listar, excluir } from '../controllers/pedidosController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

// Todas as rotas de pedido exigem usuario autenticado.
router.use(autenticar)
router.post('/', asyncHandler(criar))
router.get('/', asyncHandler(listar))
router.delete('/:id', asyncHandler(excluir))

export default router
