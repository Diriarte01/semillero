/*
Dev:    Andres Brieva
Fecha: 24/02/2023
-------------------------------
Ejericicio 1
*/

let numeros = [1,2,2,3,3,3];

const result = (numeros) =>{
    return numeros.reduce((obj, num)=>{
      if(obj[num]){
        obj[num]++;
      }else{
        obj[num] = 1;
      }
      return obj;
    },{})
}

console.log(result(numeros));

/* 
Ejericicio 2
*/

const array = [
    {
      customerName: "Nicolas",
      total: 100,
      delivered: true,
    },
    {
      customerName: "Zulema",
      total: 120,
      delivered: false,
    },
    {
      customerName: "Santiago",
      total: 20,
      delivered: false,
    }
  ];

function Ejericicio2(array){
  let total = array.map(array => array.total) 
  console.log("El total es: "+total.reduce((a, b) => a + b));
}



/* 
Ejericicio 3
*/
const palabras = ["ana", "santi", "nico", "anastasia"];
let Term = "si"
function Ejericicio3(palabras,Term){
  let newArray = [Term];
  newArray.push(palabras.filter((palabras) => palabras.includes(Term)))
  console.log(newArray)
}

Ejericicio2(array);
Ejericicio3(palabras,Term);

