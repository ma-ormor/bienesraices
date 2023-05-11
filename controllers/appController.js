import {Sequelize} from 'sequelize'
import {Categoria, Precio, Propiedad} from '../models/index.js'

const inicio = async (req, res)=>{
  const [
    categorias, precios, casas, departamentos
  ] = await Promise.all([
    Categoria.findAll({raw: true}),
    Precio.findAll({raw: true}),
    Propiedad.findAll({
      limit: 3,
      where: {id_categoria: 1},
      include: [ {model: Precio, as: 'precio'} ],
      order: [ ['createdAt', 'DESC'] ]
    }),
    Propiedad.findAll({
      limit: 3,
      where: {id_categoria: 2},
      include: [ {model: Precio, as: 'precio'} ],
      order: [ ['createdAt', 'DESC'] ]
    })
  ])//Promise.all

  res.render('inicio', {
    pagina: 'Inicio',
    categorias,
    precios,
    casas,
    departamentos,
    csrfToken: req.csrfToken()
  })
}//function

const categoria = async (req, res)=>{
  const {id} = req.params

  // Categoría existe
  const categoria = await Categoria.findByPk(id)

  if(!categoria) 
    return res.redirect('404')

  // Leer propiedades
  const propiedades = await Propiedad.findAll({
    where: {id_categoria: id},
    include: [{model: Precio}]
  })

  res.render('categoria', {
    pagina: `${categoria.nombre}s en venta`,
    propiedades,
    csrfToken: req.csrfToken()
  })//res.render
}//function

const noEncontrado = (req, res)=>{
  res.render('404', {
    pagina: 'No encontrado',
    csrfToken: req.csrfToken()
  })//res.render
}//function

const buscador = async (req, res)=>{
  const {termino} = req.body

  // La palabra está vacía
  if(!termino.trim()) return res.redirect('back')

  // Leer lugares
  const propiedades = await Propiedad.findAll({
    where: { titulo: {[Sequelize.Op.like]: '%'+termino+'%'} },
    include: [ {model: Precio} ]
  })

  res.render('busqueda', {
    pagina: 'Resultados de la búsqueda',
    propiedades,
    csrfToken: req.csrfToken()
  })
}//function

export {
  inicio, categoria, noEncontrado, buscador}