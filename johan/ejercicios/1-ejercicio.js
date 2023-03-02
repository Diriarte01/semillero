//1- Tienes un array de números entre positivos y negativos, tu reto es retornar un objeto con el número de veces que aparece un número.

const array = [1, 2, 2, 3, 3, 3]

function numOccurrences(array) {
const counts = {};
array.forEach(element => {
    if (counts[element] === undefined) {
        counts[element] = 1;
      } else {
        counts[element]++;
      }
});
return console.log(counts);
} 

numOccurrences(array);