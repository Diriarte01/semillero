/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(["N/file", 'N/record'], function (file, record) {

    function execute(context) {
        log.debug('try');
        try {
            let csvfile = file.load({
                id: 3158
            });
            let csvfileData = [];
            csvfile.lines.iterator().each(function (line) {
                let w = line.value.split(";");
                csvfileData.push({
                    tarea: w[0],
                    practicante: w[1],
                    descripcion: w[2],
                    fechac: w[3],
                    fechat: w[4],
                    fechal: w[5],
                    estado: w[6]
                });
                return true;
            });
            csvfileData.shift();

            log.debug(csvfileData);

            const uniqueTasks = Object.values(csvfileData).reduce((acc, curr) => {
                curr.forEach(item => {
                    acc.add(item.tarea);
                });
                return acc;
            }, new Set());

            log.debug([...uniqueTasks]); // muestra los valores únicos como un array
        }
        catch (error) {
            log.debug('error', error.message);
        }
    }
    return {
        execute: execute
    }
});
