const Input = [1, 2, 2, 3, 3, 3]
const counts = {};

Input.forEach(element => {
    if (counts[element] === undefined) {
        counts[element] = 1;
      } else {
        counts[element]++;
      }
});
console.log(counts);