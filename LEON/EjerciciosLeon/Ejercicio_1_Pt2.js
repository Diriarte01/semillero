/**
 *Nobre: Leon Basauri
 *Ejercicio: 1.2
 *fecha: 27/02/2023
 *@NApiVersion 2.1
 */

 const orders=
 [
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

  function suma(orders) {
    let sumando = 0; // Aquí almacenamos lo que se va sumando de las compras.
    for (let i = 0; i < orders.length; i++) {
        sumando+=orders[i].total; /*Aquí con el += se va sumando sobre la 
        misma variable lo que se encuentre dentro de la propiedad total de cada uno
        de los objetos*/
        
        }
        return sumando;
  }


console.log(suma(orders));

