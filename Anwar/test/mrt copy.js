/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(["N/file", "N/record"], function (file, record) {

    let obj = [];

    function getInputData() {
        try {
            let fileObj = file.load({
                id: 3158
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

            return task

        } catch (error) {
            log.debug('error', error.message);
        }

    }

    function dates(date) {
        const tfechac = date.split('/');
        const ffechac = new Date(tfechac[1] + '/' + tfechac[0] + '/' + tfechac[2]);
        return ffechac
    }



    function map(context) {

        let task = JSON.parse(context.value)

        let recordFather = record.create({
            type: "customrecord_padre",
            isDynamic: true,
        });
        recordFather.setValue({
            fieldId: 'name',
            value: context.key,
        });
        const saverecordFather = recordFather.save();
        log.debug("Se creó el registro padre", saverecordFather);

        let tprocess = task.filter(a => a.estado === "Proceso")

        //log.debug("tprocess", tprocess.length);

        for (const child in task) {

            try {
                let fechaTerminado = dates(task[child].fechaTermino).getTime();
                let fechaCompletado = dates(task[child].fechaCompleta).getTime();
                let fechaCreacion = dates(task[child].fechaCreate).getTime();

                let tfechaTerminado = fechaTerminado - fechaCreacion;
                let tfechaCompletado = fechaCompletado - fechaTerminado;

                tfechaTerminado = tfechaTerminado / 86400000;
                tfechaCompletado = tfechaCompletado / 86400000;

                obj.push({
                    user: task[child].practicante,
                    tfT: tfechaTerminado,
                    tfC: tfechaCompletado,
                })
                let recordChild = record.create({
                    type: "customrecord139",
                    isDynamic: true,
                });
                recordChild.setValue({
                    fieldId: 'name',
                    value: task[child].tarea,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_s4_sns_user_name',
                    value: task[child].practicante,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_descripcion',
                    value: task[child].descripcion,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_start_date',
                    value: task[child].fechaCreate,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_end_date',
                    value: task[child].fechaTermino,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_s4_sns_fechal',
                    value: task[child].fechaCompleta,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_s4_sns_status',
                    value: task[child].estado,
                });
                recordChild.setValue({
                    fieldId: 'custrecord_s4_sns_link',
                    value: saverecordFather,
                });
                const saverecordChild = recordChild.save();
                log.debug("Se creó el registro hijo", saverecordChild);
            } catch (error) {
                log.debug('error', error.message);
            }

        }

        const promedio = obj.reduce((acc, child) => acc += child.tfT, 0) / obj.length;
        const promedioC = obj.reduce((acc, child) => acc += child.tfC, 0) / obj.length;
        const fasterU = obj.reduce((acc, child) => acc = acc?.tfT < child.tfT ? acc : child, {});
        const slowerU = obj.reduce((acc, child) => acc = acc?.tfC > child.tfC ? acc : child, {});

        record.submitFields({
            type: "customrecord_padre",
            id: saverecordFather,
            values: {
                custrecord_usuario1: fasterU.user,
                custrecord_s4_sns_last_user: slowerU.user,
                custrecord_s4_sns_averages: promedio.toFixed(3),
                custrecord_s4_sns_average: promedioC.toFixed(3),
                custrecord_s4_sns_remaining: tprocess.length,
            }
        });
    }
    return {
        getInputData: getInputData,
        map: map,
    }
});
