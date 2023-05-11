import multer from "multer"
import path from 'path'
import {generarId} from '../helpers/tokens.js'

const storage = multer.diskStorage({
  destination: function(req, imagen, cb){
    cb(null, './public/uploads/')},
  filename: function(req, imagen, cb){
    cb(null, generarId()+path.extname(imagen.originalname))}
})

export default multer({storage})