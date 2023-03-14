/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(["N/file"], function (file) {
    function getInputData() {
        log.debug('getInputData');
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

            const uniqueTasks = csvfileData.reduce((acc, curr) => {
                acc.add(curr.tarea);
                return acc;
            }, new Set());

            log.debug([...uniqueTasks]);

            for (let i = 0; i < uniqueTasks.length; i++) {
                const taskData = csvfileData.filter(data => data.tarea === uniqueTasks[i]);
                console.log(taskData);

                let recordFather = record.create({
                    type: "customrecord_padre",
                    isDynamic: false,
                })
                recordFather.setValue({
                    fieldId: 'name',
                    value: taskData[0].tarea,
                })
                const saverecordFather = recordFather.save();
                log.debug("Se creó el registro padre", saverecordFather);

                taskData.map((element) => {
                    let recordChild = record.create({
                        type: "customrecord139",
                        isDynamic: false,
                    })
                    recordChild.setValue({
                        fieldId: 'name',
                        value: element.tarea,
                    })
                    recordChild.setValue({
                        fieldId: 'custrecord_s4_sns_link',
                        value: saverecordFather,
                    })
                    const saverecordChild = recordChild.save();
                    log.debug("Se creó el registro hijo", saverecordChild);
                });
            }
        }
        catch (error) {
            log.debug('error', error.message);
        }
    }


    return {
        getInputData: getInputData,

    }
});


