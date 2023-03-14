csvfileData = [
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
        tarea: "7",
        practicante: "user 2",
        descripcion: "Descripcion 2",
        fechac: "5/03/2023",
        fechat: "8/03/2023",
        fechal: "10/03/2023",
        estado: "Pendiente"
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


uniqueTasks = csvfileData.reduce((acc, curr) => {
    acc.add(curr.tarea);
    return acc;
}, new Set());

console.log([...uniqueTasks]);


const taskArray = Array.from(uniqueTasks);
for (let i = 0; i < taskArray.length; i++) {
    const taskData = csvfileData.filter(data => data.tarea === taskArray[i]);
    console.log(taskData);

    console.log("Se creó el registro padre");

    taskData.map((element) => {

        console.log("Se creó el registro hijo");
    });
}
