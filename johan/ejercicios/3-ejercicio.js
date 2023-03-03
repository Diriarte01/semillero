array = ["ana", "santi", "nico", "anastasia"]
term = "ana"

function search(array, term) {
    let resultado = []
    for (let i = 0; i < array.length; i++) {
        if (array[i].includes(term)) {
            resultado.push(array[i]);
        }
    }
    return console.log(resultado);
}
search(array, term)
