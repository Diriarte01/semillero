/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@author Catalina R
 *fecha 12/03/2023
 */
define(["N/file", "N/record"], function (file, record) {

    const getInputData = () => {
        try {
            let fileObj = file.load({
                id: 4761
            })
            let fat = {};
            let iterator = fileObj.lines.iterator();
            let son = [];
            iterator.each(() => { return false; });
            iterator.each((line) => {
                let res = line.value.split(";");
                son.push({
                    tasks: res[0],
                    trainee: res[1],
                    description: res[2],
                    dateCreate: res[3],
                    dateFinishT: res[4],
                    dateLimitC: res[5],
                    status: res[6]
                })
                return true;
            })
            son.forEach(s => {
                if (fat.hasOwnProperty("Task " + s.tasks)) {
                    fat["Task " + s.tasks].push(s)
                } else {
                    fat["Task " + s.tasks] = [s]
                }
            });
            return fat;
        } catch (error) {
            log.debug("Error inputData", error.message)
        }

    }
    const processSon = (idFather, name, objSon) => {
        // log.debug(name, objSon.trainee)
        let sonObj = record.create({
            type: "customrecord_s4_sns_record_cat_s",
            isDynamic: true
        })
        
        creatorObj = {
            name: name,
            custrecord_s4_sns_trainee: objSon.trainee,
            custrecord_s4_sns_task_descripcion: objSon.description,
            custrecord_s4_sns_start_date_task: objSon.dateCreate,
            custrecord_s4_sns_end_date_task: objSon.dateFinishT,
            custrecord_s4_sns_limit_date_finish_task: objSon.dateLimitC,
            custrecord_s4_sns_status: objSon.status,
            custrecord_s4_sns_details: idFather
        }
        for (const i in creatorObj) {
            sonObj.setValue({
                fieldId: i,
                value: creatorObj[i]
            });
        }
        sonObj.save();
        // record.submitFields({
        //     type: "customrecord_s4_sns_record_cat_s",
        //     id: sonId,
        //     values: {
        //         
        //     },
        // })
    }
    const parseDate = (a) => {
        let date = a.split("/")
        let convertDate = new Date(date[1] + "/" + date[0] + "/" + date[2])
        // let res = date.getTime() - date2.getTime();
        // res = res / (1000 * 60 * 60 * 24)
        return convertDate
    }
    const map = (father) => {
        /* return void */
        try {
            fatherValue = JSON.parse(father.value)
            let create = 0
            let finish = 0
            let limit = 0
            let terminate = {}
            let inProcess = {}
            let promT = 0;
            let promP = 0
            let count = {}
            let max = Number.MAX_VALUE
            let min = Number.MIN_VALUE
            // log.debug("fatherOBJ", [father.key, promP])

            let fatherObj = record.create({
                type: "customrecord_s4_sns_record_cat_f",
            })
            fatherObj.setValue({
                fieldId: "name",
                value: father.key
            })
            let fatherId = fatherObj.save()
            let x = 0;

            /* j es un numero este es el ancho del padre*/
            for (let j in fatherValue) {
                // log.debug(fatherId, father.key, fatherValue[j])
                processSon(fatherId, father.key, fatherValue[j])
                if (fatherValue[j].status === "Terminado") {
                    create = parseDate(fatherValue[j].dateCreate).getTime()
                    finish = parseDate(fatherValue[j].dateFinishT).getTime()
                    let process = finish - create;
                    process = process / (1000 * 60 * 60 * 24)
                    terminate.hasOwnProperty(father.key) ?
                        terminate[father.key].push({ trainee: fatherValue[j].trainee, day: process })
                        : terminate[father.key] = [{ trainee: fatherValue[j].trainee, day: process }];
                    promT = terminate[father.key].reduce((before, now) => before += now.day, 0) / terminate[father.key].length
                    promT = Number(promT.toFixed(1))
                    min = terminate[father.key].reduce((before, now) => before.day < now.day ? before : now)
                    max = terminate[father.key].reduce((before, now) => before.day > now.day ? before : now)
                    // log.debug(father.key, [min, max, promT])
                }
                else {

                    finish = parseDate(fatherValue[j].dateFinishT).getTime()
                    limit = parseDate(fatherValue[j].dateLimitC).getTime()
                    let process = limit - finish
                    process = process / (1000 * 60 * 60 * 24)
                    x++
                    count.hasOwnProperty(father.key) ?
                        count[father.key].push(x)
                        : count[father.key] = [x]
                    inProcess.hasOwnProperty(father.key) ?
                        inProcess[father.key].push(process)
                        : inProcess[father.key] = [process]
                    promP = inProcess[father.key].reduce((before, now) => before += now) / inProcess[father.key].length
                    promP = Number(promP.toFixed(2))
                    // log.debug(father.key, [promP, count[father.key]])
                }
                /* Crear logica para los que estan en proceso! */
                record.submitFields({
                    type: "customrecord_s4_sns_record_cat_f",
                    id: fatherId,
                    values: {
                        custrecord_s4_sns_prom_days: promT,
                        custrecord_s4_sns_users_more_ocp: max.trainee,
                        custrecord_s4_sns_users_less_ocp: min.trainee,
                        custrecord_s4_sns_prom_days_finish: promP,
                        custrecord_s4_sns_users_in_process: count[father.key] === undefined ? 0 : count[father.key].slice(-1)
                    },
                })

            }
        } catch (error) {
            log.debug("Error map", error.message)
        }
    }
    // const reduce = (context) => {
    //     /* return void */
    //     try {
    //         log.debug("context reduce", context)
    //         /* Por lo pronto el contexto me proporciona lo mismo que el 
    //         map, estando el map comentado o eliminado. */
    //     } catch (error) {
    //         log.debug("Error reduce", error.message)
    //     }
    // }

    const summarize = (summary) => {
        try {
            // log.debug("context sum", summary)
        } catch (error) {
            log.debug("Error summary", error.message)
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        summarize: summarize
    }
});
