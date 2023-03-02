/*
1- Tienes un array de números entre positivos y negativos, tu reto es retornar un objeto con el número de veces que aparece un número.

<code>
Input: [1, 2, 2, 3, 3, 3]
Output: {  1: 1,   2: 2,   3: 3 }
</code>
*/

const array = [1, 2, 2, 2, 2, 1, 3, 3, 3, 3];
const frecuency = {}; //objeto para la frecuencia

for (let i = 0; i < array.length; i++) {  //se itera el array
    var num = array[i]; //guarda el valor de un elemento del array
    if (frecuency[num]) { //verifica si el valor del array existe en el objeto
        frecuency[num]++; //si existe agrega 1
    } else {
        frecuency[num] = 1; //si no existe lo agrega
    }
}
console.log(frecuency); //imprime

