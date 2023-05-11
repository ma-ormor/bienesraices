import {exit} from 'node:process'
import db from '../config/db.js'

export default async () => {
  try{
    await db.sync({force: true})
    console.log('Eliminados')
    exit()
  }catch(error){
    exit(1)
  }
}