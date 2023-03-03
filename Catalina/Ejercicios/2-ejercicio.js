// 2- Tienes un array de objetos que representan órdenes de compra con los siguientes atributos:

// customerName: string total: number delivered: boolean

// Tu reto es retornar la suma total de todas las órdenes de compra, para solucionarlo crea una 
// función que recibe un parámetro de entrada:

// orders: Un array con las órdenes de compra

// Input:

// // Ouput:240
test = [
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
function operator(test) {
let sum = 0;
for (let i = 0; i < test.length; i++) {
    sum += test[i].total;
}
console.log(sum);
}
operator(test);
