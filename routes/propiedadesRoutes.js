import express from 'express'
import {body} from 'express-validator'
import {
  admin, crear, guardar, agregarImagen, guardarImagen, editar, 
  guardarCambios, eliminar, verPropiedad, enviarMensaje, 
  verMensajes, cambiarEstado} from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirArchivo.js'
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin)

router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta, 
  body('titulo').notEmpty().withMessage('Hola'), 
  body('descripcion')
    .notEmpty().withMessage('Revisa la descripción')
    .isLength({max: 200}).withMessage('Descripción muy larga'), 
  body('categoria').isNumeric().withMessage('Revisa la categoría'), 
  body('precio').isNumeric().withMessage('Revisa el precio'), 
  body('habitaciones').isNumeric().withMessage('Revisa las habitaciones'), 
  body('estacionamiento').isNumeric().withMessage('Revisa el estacionamiento'), 
  body('wc').isNumeric().withMessage('Revisa los baños'), 
  body('lat').notEmpty().withMessage('Soy el mapa'), 
  guardar)

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id', protegerRuta, upload.single('imagen'), guardarImagen)

router.get('/propiedades/editar/:id', protegerRuta, editar)
router.post('/propiedades/editar/:id', protegerRuta, 
  body('titulo').notEmpty().withMessage('Hola'), 
  body('descripcion')
    .notEmpty().withMessage('Revisa la descripción')
    .isLength({max: 200}).withMessage('Descripción muy larga'), 
  body('categoria').isNumeric().withMessage('Revisa la categoría'), 
  body('precio').isNumeric().withMessage('Revisa el precio'), 
  body('habitaciones').isNumeric().withMessage('Revisa las habitaciones'), 
  body('estacionamiento').isNumeric().withMessage('Revisa el estacionamiento'), 
  body('wc').isNumeric().withMessage('Revisa los baños'), 
  body('lat').notEmpty().withMessage('Soy el mapa'), 
  guardarCambios)

router.post('/propiedades/eliminar/:id', protegerRuta, eliminar)

router.get('/mensajes/:id', protegerRuta, verMensajes)

router.put('/propiedades/:id', protegerRuta, cambiarEstado)

//Public

router.get('/propiedad/:id', identificarUsuario, verPropiedad)

router.post('/propiedad/:id', 
  identificarUsuario, 
  body('mensaje')
    .isLength({min: 10})
    .withMessage('El mensaje está vacío o es corto'),
  enviarMensaje)

export default router