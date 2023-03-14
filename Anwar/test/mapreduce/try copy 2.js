const csvfileData = [
    {
        tarea: "7",
        practicante: "user 1",
        descripcion: "Descripcion 1",
        fechac: "5/03/2023",
        fechat: "8/03/2023",
        fechal: "10/03/2023",
        estado: "Terminado"
    },
    {
        tarea: "1",
        practicante: "user 2",
        descripcion: "Descripcion 2",
        fechac: "5/03/2023",
        fechat: "9/03/2023",
        fechal: "10/03/2023",
        estado: "Proceso"
    },
    {
        tarea: "8",
        practicante: "user 5",
        descripcion: "Descripcion 5",
        fechac: "1/03/2023",
        fechat: "7/03/2023",
        fechal: "10/03/2023",
        estado: "Terminado"
    },
    {
        tarea: "3",
        practicante: "user 6",
        descripcion: "Descripcion 6",
        fechac: "4/03/2023",
        fechat: "9/03/2023",
        fechal: "10/03/2023",
        estado: "Proceso"
    }
];
const uniqueTasks = ["7", "1", "8", "3"];

for (let i = 0; i < uniqueTasks.length; i++) {
    const taskData = csvfileData.filter(data => data.tarea === uniqueTasks[i]);
    console.log(taskData);


    taskData.map((element) => {
        const task = element.tarea;
        console.log('se creo el objeto', task);

    });
}


/* const filteredData = [];

uniqueTasks.forEach(task => {
    const taskData = csvfileData.filter(data => data.tarea === task);
    filteredData.push(...taskData);
});

console.log(filteredData);



console.log([filteredData]);
 */