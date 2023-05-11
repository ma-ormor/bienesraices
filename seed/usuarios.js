import bcrypt from 'bcrypt'

export default [
  {
    nombre: 'Marco',
    email: 'marco@bienes.com',
    confirmado: 1,
    password: bcrypt.hashSync('contra', 10)
  }
]