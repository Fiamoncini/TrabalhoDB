import { Router } from 'express'
import { registrar, login } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.post('/register', asyncHandler(registrar))
router.post('/login', asyncHandler(login))

export default router
