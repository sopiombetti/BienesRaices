import express from 'express'
import { formularioLogin, autenticar, formularioRegistro, formularioOlvidePassword, registrar} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/olvide-password', formularioOlvidePassword)


export default router