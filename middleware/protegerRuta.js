import jwt from 'jsonwebtoken'
import {Usuario} from '../models/index.js'

export default async (req, res, next)=>{
  const {_token} = req.cookies

  if(!_token)
    return res.redirect('/auth/login')

  try{
    const decode = jwt.verify(_token, 'mini')
    const usuario = await Usuario
      .scope('eliminarPassword')
      .findByPk(decode.id)
    
    if(!usuario)
      return res.redirect('/auth/login')
    req.usuario = usuario
    next()
  }catch(e){
    return res.clearCookie('_token').redirect('/auth/login')}
}