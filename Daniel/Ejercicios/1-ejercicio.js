/* // 1-  Ejercicio

const array = [1, 2, 2, 3, 3, 3,4,6,77,77]

const result = (array) => {
    return array.reduce((obj, num)=>{
        if(obj[num]){
            obj[num] ++;
        }else{
            obj[num] = 1;
        }
        return obj;
    },{})
}

console.log(result(array))

// 2- Ejercicio

const array2 = [
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
]

let suma = (array) => array.reduce((total,num)=> total += num.total, 0)
console.log(suma(array2)) */

//3- Ejercicio
const array3 = ["ana", "santi", "nico", "anastasia"];
const term = "ana";
console.log(array3.filter(i => i.includes(term)))
const filters = (ar, term) => ar.filter(i => i.includes(term));

console.log(filters(array3, term));