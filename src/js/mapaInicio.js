(function(){
  const lat = 20.67444163271174;
  const lng = -103.38739216304566;
  const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

  let markers = new L.FeatureGroup().addTo(mapa)
  let propiedades = []

  const filtros = {categoria: '', precio: ''}
  const categorias = document.querySelector('#categorias')
  const precios = document.querySelector('#precios')
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);

  categorias.addEventListener('change', e => {
    filtros.categoria = +e.target.value
    filtrarPropiedades()
  })

  precios.addEventListener('change', e => {
    filtros.precio = +e.target.value
    filtrarPropiedades()
  })

  const obtenerPropiedades = async ()=>{
    try{
      const url = '/api/propiedades'
      const respuesta = await fetch(url)
      
      propiedades = await respuesta.json()
      mostrarPropiedades(propiedades)
    }catch(e){console.log(e)}
  }//fuction

  const mostrarPropiedades = propiedades =>{
    // Limpiar markers
    markers.clearLayers()
    // Nuevos markers
    propiedades.forEach(propiedad => {
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true
      })
      .addTo(mapa)
      .bindPopup(`
        <h1 class="text-xl font-extrabold uppercase my-5">
          ${propiedad?.titulo}</h1>
        <img 
          src="/uploads/${propiedad?.imagen}" 
          alt="Foto de ${propiedad?.titulo}"/>
        <p class="text-gray-600 font-bold">
          ${propiedad.precio.nombre}
          <span class="text-indigo-600 font-bold">
            ${propiedad.categorium.nombre}</span></p>
        <a 
          href="/propiedad/${propiedad?.id}" 
          class="bg-indigo-600 block p-2 text-center font-bold uppercase">
          Ver Propiedad</a>
      `)
      markers.addLayer(marker)
    })//L.marker()
  }//function
  
  const filtrarPropiedades = () => {
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio)
    mostrarPropiedades(resultado)
  }//function

  const filtrarCategoria = propiedad => 
    filtros.categoria ? propiedad.id_categoria === filtros.categoria : propiedad
  
  const filtrarPrecio = propiedad => 
    filtros.precio ? propiedad.id_precio === filtros.precio : propiedad

  obtenerPropiedades()
})()