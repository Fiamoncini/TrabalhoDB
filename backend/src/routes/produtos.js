import { Router } from 'express'
import { listar, obter } from '../controllers/produtosController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(listar))
router.get('/:id', asyncHandler(obter))

export default router
