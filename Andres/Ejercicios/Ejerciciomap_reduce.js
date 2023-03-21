/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(['N/file', 'N/record'], function (file, record) {
    let daysConsumed = []
    function getInputData() {
        try {
            let fileObj = file.load({
                id: 4760
            })

            let iterator = fileObj.lines.iterator();
            let test = [];
            let dadtask = []
            dadtask.push(0)
            let cont = 0
            iterator.each((line) => {
                if (cont == 0) {
                    cont++;
                    return true;
                } else {
                    let res = line.value.split(";");
                    if (dadtask.includes(res[0])) {

                    } else {
                        dadtask.push(res[0])
                    }
                    let daycreate = res[3].split('/')
                    let datecreate = new Date(daycreate[1] + '/' + daycreate[0] + '/' + daycreate[2])
                    let daytermino = res[4].split('/')
                    let datetermino = new Date(daytermino[1] + '/' + daytermino[0] + '/' + daytermino[2])
                    let daycompleta = res[5].split('/')
                    let datecompleta = new Date(daycompleta[1] + '/' + daycompleta[0] + '/' + daycompleta[2])
                    test.push({
                        tarea: res[0],
                        practicante: res[1],
                        descripcion: res[2],
                        fechaCreate: datecreate,
                        fechaCGetTime: datecreate.getTime(),
                        fechaTermino: datetermino,
                        fechaTGetTime: datetermino.getTime(),
                        fechaCompleta: datecompleta,
                        fechaCTGetTime: datecompleta.getTime(),
                        estado: res[6]
                    })
                    return true;
                }

            })
            dadtask.shift()
            dadtask.sort((a, b) => a - b)
            test.sort((a, b) => a.tarea - b.tarea)
            let sonstaks = {}
            let task = []
            for (let i = 0; i < dadtask.length; i++) {
                sonstaks = test.filter(a => a.tarea === dadtask[i])

                task.push({
                    tarea: dadtask[i],
                    tareas: sonstaks,
                })
            }
            return task

        } catch (e) {
            log.error('Erro en el map', e.message)
        }

    }

    function map(context) {
        try {
            const value = JSON.parse(context.value);
            const dadObj = record.create({
                type: 'customrecord_s4_register_dad',
            })
            dadObj.setValue({
                fieldId: 'name',
                value: 'tarea' + value.tarea
            })
            let fieldtDad = dadObj.save()
            for (let i = 0; i < value.tareas.length; i++) {
                let sonObj = record.create({
                    type: "customrecord_s4_sns_record_son_andres",
                    isDynamic: true
                })
                sonObj.setValue({
                    fieldId: "name",
                    value: "Tarea" + value.tareas[i].tarea
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_trainner",
                    value: value.tareas[i].practicante
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_task_description",
                    value: value.tareas[i].descripcion
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_date_start_task",
                    value: value.tareas[i].fechaCreate
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_date_end_task",
                    value: value.tareas[i].fechaTermino
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_date_limit_task",
                    value: value.tareas[i].fechaCompleta
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_status_task",
                    value: value.tareas[i].estado
                })
                sonObj.setValue({
                    fieldId: "custrecord_s4_sns_register_dad",
                    value: fieldtDad
                })
                sonObj.save();
                let dias = (value.tareas[i].fechaTGetTime) - (value.tareas[i].fechaCGetTime)//seteando fechas
                let diff_ = dias / (1000 * 60 * 60 * 24);
                let days = (value.tareas[i].fechaCTGetTime) - (value.tareas[i].fechaTGetTime)//seteando fechas
                let diff_C = days / (1000 * 60 * 60 * 24);
                daysConsumed.push({
                    user: value.tareas[i].practicante,
                    days: diff_,
                    daysC: diff_C
                })
            }
            let proceso = value.tareas.filter(proceso => proceso.estado === "Proceso")//calculamos el total de tareas en proceso
            const promedy = daysConsumed.reduce((current, previous) => current += previous.days, 0) / daysConsumed.length;//promedio de tareas por dias consumidos
            const promedyC = daysConsumed.reduce((current, previous) => current += previous.daysC, 0) / daysConsumed.length;  //promedio de tareas por dias tareas faltantes
            const minday = daysConsumed.reduce((menor, item) => menor = menor?.days < item.days ? menor : item, {}); // usuario que menos dias le tomo terminar la tarea
            const maxday = daysConsumed.reduce((mayor, item) => mayor = mayor?.days > item.days ? mayor : item, {});// usuario que mas dias le tomo terminar la tarea
            record.submitFields({
                type: 'customrecord_s4_register_dad',
                id: fieldtDad,
                values: {
                    custrecord_s4_sns_promedy_days: promedy,
                    custrecord_s4_sns_user_less_task: minday.user,
                    custrecord_s4_sns_user_more_task: maxday.user,
                    custrecord_s4_sns_promedy_days_finish: promedyC,
                    custrecord_s4_sns_total_user_in_process: proceso.length
                }
            })
        } catch (error) {

        }
    }

    function reduce(context) {

    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        //reduce: reduce,
        //summarize: summarize
    }
});
