import {validationResult} from 'express-validator'
import {unlink} from 'node:fs/promises'
import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import {esVendedor, formatearFecha} from '../helpers/index.js'

const admin = async (req, res) => {
  const {pagina/*:paginaActual*/} = req.query
  const expresion = /ʌ[1-9]$/

  //if(!expresion.test(pagina))
  //  return res.redirect('mis-propiedades?pagina=1')

  try{
    const {id} = req.usuario
    // Límites / Offset paginador
    const limit = 2
    const offset = (pagina*limit) - limit
    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: {id_usuario: id},
        include: [
          {model: Categoria},
          {model: Precio},
          {model: Mensaje}
        ]
      }),
      Propiedad.count({where:{id_usuario: id}})
    ])

    res.render('propiedades/admin', {
      paginaActual: Number(pagina),
      pagina: 'Mis Propiedades',
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total/limit),
      propiedades,
      total,
      offset,
      limit
    })  
  }catch(e){console.log(e)}
}//function

/* const mostrar = async (res, errores) => {
  const [precios, categorias] = await Promise.all([
    Precio.findAll(),
    Categoria.findAll()
  ])

  res.render('propiedades/crear', {
    pagina: 'Nueva Propiedad',
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    errores
  })
} */

const crear = async (req, res) => {
  //mostrar(res, [])

  const [precios, categorias] = await Promise.all([
    Precio.findAll(),
    Categoria.findAll()
  ])

  res.render('propiedades/crear', {
    pagina: 'Nueva Propiedad',
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  })
}//function

const guardar = async (req, res) => {
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    //return mostrar(res, resultado.array())
    const [precios, categorias] = await Promise.all([
      Precio.findAll(),
      Categoria.findAll()
    ])
  
    return res.render('propiedades/crear', {
      pagina: 'Nueva Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    })
  }

  const {
    titulo, descripcion, habitaciones, 
    estacionamiento, wc, calle, lat, lng, 
    precio: id_precio, categoria: id_categoria
  } = req.body

  const {id: id_usuario} = req.usuario

  try{
    const propiedad = await Propiedad.create({
      titulo, 
      descripcion, 
      habitaciones, 
      estacionamiento, 
      wc,
      calle,
      lat,
      lng,
      id_precio,
      id_categoria,
      id_usuario,
      imagen: ''
    })

    const {id} = propiedad
    res.redirect(`/propiedades/agregar-imagen/${id}`)
  }catch(error){}
}//function

const agregarImagen = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad no publicada
  if(propiedad.publicado)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  res.render('propiedades/agregar-imagen', {
    pagina: `Fotografías de ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  })
}//function

const guardarImagen = async (req, res, next)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad no publicada
  if(propiedad.publicado)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  try{
    propiedad.imagen = req.file.filename
    propiedad.publicado = 1

    await propiedad.save()
    next()
  }catch(e){console.log(e)}
}//function

const editar = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  const [precios, categorias] = await Promise.all([
    Precio.findAll(),
    Categoria.findAll()
  ])

  res.render('propiedades/editar', {
    pagina: `Editar Propiedad ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad
  })
}//function

const guardarCambios = async (req, res)=>{
  let resultado = validationResult(req)

  if(!resultado.isEmpty()){
    //return mostrar(res, resultado.array())
    const [precios, categorias] = await Promise.all([
      Precio.findAll(),
      Categoria.findAll()
    ])

    return res.render('propiedades/editar', {
      pagina: 'Editar Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body
    })
  }//if

  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  try{
    const {
      titulo, descripcion, habitaciones, 
      estacionamiento, wc, calle, lat, lng, 
      precio: id_precio, categoria: id_categoria
    } = req.body

    propiedad.set({
      titulo, descripcion, habitaciones, 
      estacionamiento, wc, calle, lat, lng, 
      id_precio, id_categoria
    })

    await propiedad.save()
    res.redirect('/mis-propiedades')
  }catch(e){console.log(e)}
}//function

const eliminar = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  await unlink(`public/uploads/${propiedad.imagen}`)
  await propiedad.destroy()
  res.redirect('/mis-propiedades')
}//function

const cambiarEstado = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id)

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  propiedad.publicado = !propiedad.publicado 
  await propiedad.save()

  res.json({resultado: true})
}//function

const verPropiedad = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {model: Categoria}, {model: Precio}]
  })

  //La propiedad existe
  if(!propiedad || !propiedad.publicado)
    return res.redirect('/404')

  res.render('propiedades/mostrar', {
    pagina: propiedad.titulo,
    propiedad,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.id_usuario)
  })
}//function

const enviarMensaje = async (req, res)=>{
  let resultado = validationResult(req)

  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {model: Categoria}, {model: Precio}]
  })

  if(!propiedad) //La propiedad existe
    return res.redirect('/404')

  if(!resultado.isEmpty())
    return res.render('propiedades/mostrar', {
      pagina: propiedad.titulo,
      propiedad,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, propiedad.id_usuario),
      errores: resultado.array()
    })//res.render

  const {mensaje: cuerpo} = req.body
  const {id: id_propiedad} = req.params
  const {id: id_usuario} = req.usuario

  // Guardar mensaje
  await Mensaje.create({
    cuerpo, id_propiedad, id_usuario})
    
  res.redirect('/')
  /* 
  res.render('propiedades/mostrar', {
    pagina: propiedad.titulo,
    propiedad,
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.id_usuario),
    enviado: true
  })//res.render 
  */
}//function

const verMensajes = async (req, res)=>{
  const {id} = req.params
  const propiedad = await Propiedad.findByPk(id, {
    include: [{
      model: Mensaje,
      include: [{model: Usuario.scope('eliminarPassword')}]
    }]
  })

  //La propiedad existe
  if(!propiedad)
    return res.redirect('/mis-propiedades')
  //La propiedad es del usuario
  if(req.usuario.id.toString() !== propiedad.id_usuario.toString())
    return res.redirect('/mis-propiedades')

  res.render('propiedades/mensajes', {
    pagina: 'Mensajes',
    mensajes: propiedad.mensajes,
    formatearFecha
  })//res.render
}//function

export {
  admin, crear, guardar, agregarImagen, guardarImagen,
  editar, guardarCambios, eliminar, verPropiedad,
  enviarMensaje, verMensajes, cambiarEstado
}//export