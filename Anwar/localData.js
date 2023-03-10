let fileObj = file.load({
    id: 4760
})
let iterator = fileObj.lines.iterator();
let csv = [];
let dadtask = []
dadtask.push(0)
let cont = 0
iterator.each((line) => {
    if (cont == 0) {//limitando agregar linea de columnas del csv
        cont++;
        return true;
    } else {
        let res = line.value.split(";");
        if (dadtask.includes(res[0])) {//validando repetidos en tareas padre
        } else {
            dadtask.push(res[0])//filtrando tareas padre
        }
        csv.push({
            tarea: res[0],
            practicante: res[1],
            descripcion: res[2],
            fechaCreate: res[3],
            fechaTermino: res[4],
            fechaCompleta: res[5],
            estado: res[6]
        })
        return true;
    }
})
dadtask.shift()
dadtask.sort((a, b) => a - b)//organizando tareas padre
csv.sort((a, b) => a.tarea - b.tarea)
let sonstaks = {}
let task = {}
for (let i = 0; i < dadtask.length; i++) {
    sonstaks = csv.filter(a => a.tarea === dadtask[i])
    task["Tarea" + dadtask[i]] = sonstaks//creando array dinamico
}