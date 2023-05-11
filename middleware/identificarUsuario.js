import jwt from 'jsonwebtoken'

import Usuario from '../models/Usuario.js'

export default async (req, res, next)=>{
  // Hay un token
  const {_token} = req.cookies

  if(!_token){
    req.usuario = null 
    return next()}

  try{
    const decode = jwt.verify(_token, 'mini')
    const usuario = await Usuario
      .scope('eliminarPassword')
      .findByPk(decode.id)
    
    if(usuario)
      req.usuario = usuario

    return next()
  }catch(e){
    console.log(e)
    return res.clearCookie('_token').redirect('/auth/login')
  }//try
}