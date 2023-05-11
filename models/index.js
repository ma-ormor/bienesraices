import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'

Propiedad.belongsTo(Precio, {foreignKey: 'id_precio'})
Propiedad.belongsTo(Categoria, {foreignKey: 'id_categoria'})
Propiedad.belongsTo(Usuario, {foreignKey: 'id_usuario'})
Propiedad.hasMany(Mensaje, {foreignKey: 'id_propiedad'})
Mensaje.belongsTo(Propiedad, {foreignKey: 'id_propiedad'})
Mensaje.belongsTo(Usuario, {foreignKey: 'id_usuario'})

export {Propiedad, Precio, Categoria, Usuario, Mensaje}