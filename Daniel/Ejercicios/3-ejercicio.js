let array = ["ana", "santi", "nico", "anastasia"];
let term = "ana";
let ouput = [];
for (let i = 0; i < array.length; i++) {
    if (array[i].indexOf(term) != -1) {
        ouput.push(array[i]);
       
    }
}
console.log("ouput: " + ouput);

