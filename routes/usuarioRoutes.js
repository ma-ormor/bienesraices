import express from 'express'

import { 
  formularioLogin, autenticar, cerrarSesion, formularioRegistro, registrar, 
  confirmar,formularioOlvidePassword, resetPassword,
  comprobarToken, nuevaContraseña
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin)
router.post('/login', autenticar)
router.post('/salir', cerrarSesion)
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/confirmar/:token', confirmar)
router.get('/recuperar-contrasena', formularioOlvidePassword)
router.post('/recuperar-contrasena', resetPassword)
router.get('/recuperar-contrasena/:token', comprobarToken)
router.post('/recuperar-contrasena/:token', nuevaContraseña)

export default router