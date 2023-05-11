(function(){
  const cambiarEstado = document.querySelectorAll('.cambiar-estado')
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  cambiarEstado.forEach(boton => {
    addEventListener('click', cambiarEstadoPropiedad)
  })

  async function cambiarEstadoPropiedad(e){
    const {propiedadId: id} = e.target.dataset

    try{
      const url = `/propiedades/${id}`
      const respuesta = await fetch(url, {
        method: 'PUT',
        headers: {'CSRF-token': token}
      })
      const {resultado} = await respuesta.json()

      if(resultado)
        if(e.target.classList.contains('bg-yellow-100')){
          e.target.classList.add('bg-green-100', 'text-green-800')
          e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
          e.target.textContent = 'Publicada'
        }else{
          e.target.classList.add('bg-yellow-100', 'text-yellow-800')
          e.target.classList.remove('bg-green-100', 'text-green-800')
          e.target.textContent = 'Sin publicar'
        }//if
    }catch(error){console.log(error)}
  }//function
})()