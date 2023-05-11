import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import {generarJWT, generarId} from '../helpers/tokens.js'
import {emailRegistro, emailOlvidePassword} from '../helpers/emails.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
    csrfToken: req.csrfToken()
  })
}//function

const autenticar = async (req, res) => {
  let resultado

  await check('email')
    .isEmail()
    .withMessage('Revisa el email')
    .run(req)
  await check('password')
    .notEmpty()
    .withMessage('Revisa la contraseña')
    .run(req)

  resultado = validationResult(req)

  if(!resultado.isEmpty())
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })

  const {email, password} = req.body
  const usuario = await Usuario.findOne({where:{email}})

  if(!usuario)
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      errores: [{msg:'No encontramos tu cuenta'}],
      csrfToken: req.csrfToken()
    })

  if(!usuario.confirmado)
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      errores: [{msg:'Confirma la cuenta, antes de empezar'}],
      csrfToken: req.csrfToken()
    })

  if(!usuario.revisarPassword(password))
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      errores: [{msg:'Revisa la contraseña'}],
      csrfToken: req.csrfToken()
    })

  const token = generarJWT(usuario.id)

  return res
    .cookie('_token', token, {httpOnly:true})
    .redirect('/mis-propiedades')
}//function

const cerrarSesion = (req, res)=>{
  return res.clearCookie('_token').status('200').redirect('/auth/login')
}//function

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
    csrfToken: req.csrfToken()
  })
}//function

const registrar = async (req, res) => {
  let resultado

  await check('nombre')
    .notEmpty()
    .withMessage('Nombre vacío')
    .run(req)
  await check('email')
    .isEmail()
    .withMessage('Revisa el email')
    .run(req)
  await check('password')
    .isLength({min:6})
    .withMessage('Mínimo 6 carácteres')
    .run(req)
  await check('repetir_password')
    .equals(req.body.password)
    .withMessage('Contraseñas diferentes')
    .run(req)

  resultado = validationResult(req)

  if(!resultado.isEmpty())
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: resultado.array(),
      csrfToken: req.csrfToken(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        repetir_password: req.body.repetir_password
      }
    })

  const {nombre, email, password} = req.body

  const existeUsuario = await Usuario.findOne({
    where: {email}
  })

  if(existeUsuario)
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: [{msg: 'La cuenta ya existe'}],
      usuario: {nombre, email},
      csrfToken: req.csrfToken()
    })

  const usuario = await Usuario.create({
    nombre, email, password, token: generarId()
  })

  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })

  res.render('templates/mensaje', {
    pagina: 'Cuenta Creada',
    mensaje: 'Confirma tú cuenta en tu correo'
  })
}//function

const confirmar = async (req, res, next) => {
  const {token} = req.params
  console.log(token)

  //Revisar Token
  const usuario = await Usuario.findOne({where: {token}})

  if(!usuario)
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al confirmar cuenta',
      mensaje: 'No encontramos tú cuenta',
      error: true
    })

  //Confirmar cuenta
  usuario.token = null
  usuario.confirmado = true
  await usuario.save()

  res.render('auth/confirmar-cuenta', {
    pagina: 'Cuenta Confirmada',
    mensaje: 'Se confirmó tu cuenta'
  })
}//function

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tú Acceso',
    csrfToken: req.csrfToken()
  })
}//function

const resetPassword = async (req, res) => {
  let resultado

  await check('email')
    .isEmail()
    .withMessage('Revisa el email')
    .run(req)

  resultado = validationResult(req)

  if(!resultado.isEmpty())
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tú Acceso',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    })

  const {email} = req.body
  const usuario = await Usuario.findOne({where:{email}})

  if(!usuario)
    res.render('auth/olvide-password', {
      pagina: 'Recupera tú Acceso',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'La cuenta no existe'}]
    })

  usuario.token = generarId()
  await usuario.save() 

  const {nombre, token} = usuario

  emailOlvidePassword({
    email,
    nombre,
    token
  })//emailOlvidePassword

  res.render('templates/mensaje', {
    pagina: 'Cambia tu contraseña',
    mensaje: 'Revisa los pasos en tu correo'
  })
}//function

const comprobarToken = async (req, res) => {
  const {token} = req.params
  const usuario = await Usuario.findOne({where:{token}})

  if(!usuario)
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Cambia tu contraseña',
      mensaje: 'No encontramos tú cuenta',
      error: true
    })
  
  res.render('auth/nueva-contraseña', {
    pagina: 'Cambia tu Contraseña',
    csrfToken: req.csrfToken()
  })
}//function

const nuevaContraseña = async (req, res) => {
  let resultado

  // Revisar contraseña
  await check('password')
    .isLength({min:6})
    .withMessage('Mínimo 6 carácteres')
    .run(req)

  resultado = validationResult(req)

  if(!resultado.isEmpty())
    return res.render('auth/nueva-contraseña', {
      pagina: 'Cambia tu Contraseña',
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  // Ver quién es
  const {token} = req.params
  const {password} = req.body
  const usuario = await Usuario.findOne({where:{token}})
  // Ocultar contraseña
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)
  usuario.token = null

  await usuario.save()
  
  res.render('auth/confirmar-cuenta', {
    pagina: 'Contraseña Cambiada',
    mensaje: 'Puedes entrar a tu cuenta'
  })
}//function

export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevaContraseña
}//export