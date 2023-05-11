const esVendedor = (usuario, creadorPropiedad)=>{
  return usuario === creadorPropiedad}

const formatearFecha = fecha => {
  const nueva = new Date(fecha).toISOString().slice(0, 10)
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    mont: 'long',
    day: 'numeric'
  }//opciones
  return new Date(nueva).toLocaleDateString('es-ES', opciones)
}//function

export {esVendedor, formatearFecha}