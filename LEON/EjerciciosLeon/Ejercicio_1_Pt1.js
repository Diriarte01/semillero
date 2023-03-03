/**
 *Nombre: Leon Basauri
 *Ejercicio: 1.1
 *fecha: 27/02/2023
 *@NApiVersion 2.1
 */

let array = [1, 2, 2, 3, 3, 3]

function numberOfCharacters(arrayNumbers) {
    let result = {}; //Objeto que guardará el resultado

    for (let i = 0; i < arrayNumbers.length; i++) {
        if (result[arrayNumbers[i]]) { //¿Existe la propiedad del objeto result?
            result[arrayNumbers[i]]++; //Sí existe, le sumamos 1
        }
        else { //No existe. La creamos con valor 1
            result[arrayNumbers[i]] = 1;
        }
    }
    return result;
}
console.log(numberOfCharacters(array));

