/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n  const lat = 20.67444163271174;\r\n  const lng = -103.38739216304566;\r\n  const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);\r\n\r\n  let markers = new L.FeatureGroup().addTo(mapa)\r\n  let propiedades = []\r\n\r\n  const filtros = {categoria: '', precio: ''}\r\n  const categorias = document.querySelector('#categorias')\r\n  const precios = document.querySelector('#precios')\r\n  \r\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n      attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n  }).addTo(mapa);\r\n\r\n  categorias.addEventListener('change', e => {\r\n    filtros.categoria = +e.target.value\r\n    filtrarPropiedades()\r\n  })\r\n\r\n  precios.addEventListener('change', e => {\r\n    filtros.precio = +e.target.value\r\n    filtrarPropiedades()\r\n  })\r\n\r\n  const obtenerPropiedades = async ()=>{\r\n    try{\r\n      const url = '/api/propiedades'\r\n      const respuesta = await fetch(url)\r\n      \r\n      propiedades = await respuesta.json()\r\n      mostrarPropiedades(propiedades)\r\n    }catch(e){console.log(e)}\r\n  }//fuction\r\n\r\n  const mostrarPropiedades = propiedades =>{\r\n    // Limpiar markers\r\n    markers.clearLayers()\r\n    // Nuevos markers\r\n    propiedades.forEach(propiedad => {\r\n      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n        autoPan: true\r\n      })\r\n      .addTo(mapa)\r\n      .bindPopup(`\r\n        <h1 class=\"text-xl font-extrabold uppercase my-5\">\r\n          ${propiedad?.titulo}</h1>\r\n        <img \r\n          src=\"/uploads/${propiedad?.imagen}\" \r\n          alt=\"Foto de ${propiedad?.titulo}\"/>\r\n        <p class=\"text-gray-600 font-bold\">\r\n          ${propiedad.precio.nombre}\r\n          <span class=\"text-indigo-600 font-bold\">\r\n            ${propiedad.categorium.nombre}</span></p>\r\n        <a \r\n          href=\"/propiedad/${propiedad?.id}\" \r\n          class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">\r\n          Ver Propiedad</a>\r\n      `)\r\n      markers.addLayer(marker)\r\n    })//L.marker()\r\n  }//function\r\n  \r\n  const filtrarPropiedades = () => {\r\n    const resultado = propiedades\r\n      .filter(filtrarCategoria)\r\n      .filter(filtrarPrecio)\r\n    mostrarPropiedades(resultado)\r\n  }//function\r\n\r\n  const filtrarCategoria = propiedad => \r\n    filtros.categoria ? propiedad.id_categoria === filtros.categoria : propiedad\r\n  \r\n  const filtrarPrecio = propiedad => \r\n    filtros.precio ? propiedad.id_precio === filtros.precio : propiedad\r\n\r\n  obtenerPropiedades()\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;