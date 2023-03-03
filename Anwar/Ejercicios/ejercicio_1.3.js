/*
3- Tu reto es retornar un array solo con las palabras que cumplan con la condición de tener un término de búsqueda dado.

Para solucionarlo vas a encontrar crea una función que recibe los siguientes parámetros de entrada:

array: Un array de strigs con palabras
term: Un string con el término a buscar

<code>
Input: array: ["ana", "santi", "nico", "anastasia"] term: "ana"
Ouput: ["ana", "anastasia"]
</code>
*/

const names = ["ana", "santi", "nico", "anastasia"];
const ref = "ana";
const filtered = match(names, ref);

function match(names, ref) {
    let answer = names.filter(word => word.includes(ref));
    return answer;
}
console.log(filtered);