/**
 *Nombre: Leon Basauri
 *Ejercicio: 1.3
 *fecha: 27/02/2023
 *@NApiVersion 2.1
 */

const nombres = ["ana", "santi", "nico", "anastasia"]
const term = "ana"

function filtrarNombres(array, palabra_a_buscar) {
   
   nombresFiltrados=array.filter((array) => array.includes(palabra_a_buscar));
   
   return nombresFiltrados
}

console.log(filtrarNombres(nombres, term))
