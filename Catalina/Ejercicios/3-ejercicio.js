// 3- Tu reto es retornar un array solo con las palabras que cumplan con la condición de 
// tener un término de búsqueda dado.

// Para solucionarlo vas a encontrar crea una función que recibe los siguientes parámetros 
// de entrada:

// array: Un array de strigs con palabras term: Un string con el término a buscar

// Input: array: ["ana", "santi", "nico", "anastasia"] term: "ana"
// Ouput: ["ana", "anastasia"]

let array = ["ana", "santi", "nico", "anastasia"]
let term = "ana"
// function search(array, term) {
    
//     return array.includes(term);
// }
// console.log(search(array, term))
// console.log(array.filter(function(item){
//     return item.includes(term)
// }))
console.log(array.filter((nombre)=> nombre.includes(term)))