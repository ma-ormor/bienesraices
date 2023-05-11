import jwt from 'jsonwebtoken'

const generarJWT = id =>
  jwt.sign({id}, 'mini', {expiresIn: '1d'})

const generarId = () => 
  Math.random().toString().substring(2) + Date.now().toString(32)

export {
  generarJWT,
  generarId
}