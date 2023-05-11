import {Dropzone} from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube tus fotos aquí',
  dictRemoveFile: 'Borrar archivo',
  dictMaxFilesExceeded: 'Solo un archivo máximo',
  acceptedFiles: '.png,.jpg,.jpeg',
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  headers: {'CSRF-token': token},
  paramName: 'imagen',
  init: function(){
    const dropzone = this
    const publicar = document.querySelector('#publicar')

    publicar.addEventListener('click', function(){
      dropzone.processQueue()})

    dropzone.on('queuecomplete', function(){
      if(dropzone.getActiveFiles().length == 0)
        window.location.href = '/mis-propiedades'})
  }
}