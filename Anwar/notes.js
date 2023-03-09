const objetos = [
    { valores: [1, 2, 3] },
    { valores: [2, 3, 4] },
    { valores: [1, 2, 5] },
    { valores: [6, 7, 8] },
    { valores: [1, 9, 10] },
];

const valoresUnicos = {};

objetos.forEach(objeto => {
    const primerValor = objeto.valores[0];
    if (!valoresUnicos[primerValor]) {
        valoresUnicos[primerValor] = true;
    }
});

const cantidadValoresUnicos = Object.keys(valoresUnicos).length;

console.log(cantidadValoresUnicos); // Imprime 4
