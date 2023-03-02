// 1- Tienes un array de números entre positivos y negativos, tu reto es retornar un objeto con el 
// número de veces que aparece un número.


// Input: [1, 2, 2, 3, 3, 3]
// Output: {  1: 1,   2: 2,   3: 3 }
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//hay que cerrarlo por que queda recibiendo datos
readline.question("Numeros ", numbers =>{
    let change = numbers.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    let elements = new Object();
    for (let i = 0; i < change.length; i++) {
        let number = change[i];
        if (elements[number]) {
            elements[number]++;
        }else{
            elements[number] = 1
        }
        
    }
    console.log(elements);

    readline.close();
})