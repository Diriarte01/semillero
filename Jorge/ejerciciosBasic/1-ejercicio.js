
let input = [1, 2, 2, 3, 3, 3];
let ouput = new Map(); 
let index;

for(let i = 0; i < input.length; i++){
    index = ouput.get(input[i]);
    if(index){
        ouput.set(input[i],index+1);        
    }else{
        ouput.set(input[i], 1);
    }    
}
console.log(ouput);
