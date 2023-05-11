import {exit} from 'node:process'
import usuarios from './usuarios.js';
import categorias from "./categorias.js";
import precios from "./precios.js"
import db from "../config/db.js";
import eliminarDatos from './eliminarDatos.js';
import {Categoria, Precio, Usuario} from '../models/index.js'

const importarDatos = async () => {
  try{
    await db.authenticate() //Conectar con la BD
    await db.sync() //Crea las columnas
    await Promise.all([
      Categoria.bulkCreate(categorias), //Vacía los datos
      Precio.bulkCreate(precios), //Vacía los datos
      Usuario.bulkCreate(usuarios) //Vacía los datos
    ])
    exit()
  }catch(error){
    exit(1)
  }
}

if(process.argv[2] === '-i')
  importarDatos()
if(process.argv[2] === '-e')
  eliminarDatos()