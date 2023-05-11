import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

const app = express(); // Crear la app
const port = process.env.PORT || 3000

// Para leer formularios
app.use(express.urlencoded({extended:true}))
//
app.use(cookieParser())
app.use(csrf({cookie: true}))

try{
  await db.authenticate();
  db.sync() //Actualiza BD
  console.log('Conexión correcta');
}catch(error){console.log(error)}

app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

app.listen(port, () => {
  console.log('net start mysql\nhttps://mailtrap.io/')
  console.log('El servidor funciona en localhost:' + port)
});