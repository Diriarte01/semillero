/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 *@author Catalina R
 *Fecha 03/08/2023
 */
define(["N/file", "N/record"], function (file, record) {


    const processSon = (idFather, name, objSon) => {

        let sonObj = record.create({
            type: "customrecord_s4_sns_record_cat_s",
            isDynamic: true
        })
        sonObj.setValue({
            fieldId: "name",
            value: name
        });
        let sonId = sonObj.save();
        record.submitFields({
            type: "customrecord_s4_sns_record_cat_s",
            id: sonId,
            values: {
                custrecord_s4_sns_trainee: objSon.trainee,
                custrecord_s4_sns_task_descripcion: objSon.description,
                custrecord_s4_sns_start_date_task: objSon.dateCreate,
                custrecord_s4_sns_end_date_task: objSon.dateFinishT,
                custrecord_s4_sns_limit_date_finish_task: objSon.dateLimitC,
                custrecord_s4_sns_status: objSon.status,
                custrecord_s4_sns_details: idFather
            },
        })
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_trainee",
        //     value: objSon.trainee
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_task_descripcion",
        //     value: objSon.description
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_start_date_task",
        //     value: objSon.dateCreate
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_end_date_task",
        //     value: objSon.dateFinishT
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_limit_date_finish_task",
        //     value: objSon.dateLimitC
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_status",
        //     value: objSon.status
        // });
        // sonObj.setValue({
        //     fieldId: "custrecord_s4_sns_details",
        //     value: idFather
        // })

    }
    const parseDate = (a) => {
        let date = a.split("/")
        let convertDate = new Date(date[1] + "/" + date[0] + "/" + date[2])
        // let res = date.getTime() - date2.getTime();
        // res = res / (1000 * 60 * 60 * 24)
        return convertDate
    }
    const execute = (context) => {
        try {
            let fileObj = file.load({
                id: 4761
            })
            let iterator = fileObj.lines.iterator();
            let son = [];
            let father = {};
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
                if (father.hasOwnProperty("Task " + s.tasks)) {
                    father["Task " + s.tasks].push(s)
                } else {
                    father["Task " + s.tasks] = [s]
                }
            });

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
            
            for (let j in father) {
                let fatherObj = record.create({
                    type: "customrecord_s4_sns_record_cat_f",
                })
                fatherObj.setValue({
                    fieldId: "name",
                    value: j
                })
                let fatherId = fatherObj.save()
                let x = 0;
                father[j].forEach(l => {
                    processSon(fatherId, j, l)
                    if (l.status === "Terminado") {
                        create = parseDate(l.dateCreate).getTime()
                        finish = parseDate(l.dateFinishT).getTime()
                        let process = finish - create;
                        process = process / (1000 * 60 * 60 * 24)
                        terminate.hasOwnProperty(j) ?
                            terminate[j].push({ trainee: l.trainee, day: process })
                            : terminate[j] = [{ trainee: l.trainee, day: process }];
                        promT = terminate[j].reduce((before, now) => before += now.day, 0) / terminate[j].length
                        promT = Number(promT.toFixed(1))
                        min = terminate[j].reduce((before, now) => before.day < now.day ? before : now)
                        max = terminate[j].reduce((before, now) => before.day > now.day ? before : now)
                        // log.debug(j, [min, max, promT])
                    }
                    else {
                        
                        finish = parseDate(l.dateFinishT).getTime()
                        limit = parseDate(l.dateLimitC).getTime()
                        let process = limit - finish
                        process = process / (1000 * 60 * 60 * 24)
                        x++
                        count.hasOwnProperty(j)? 
                        count[j].push(x) 
                        : count[j] = [x]
                        inProcess.hasOwnProperty(j) ?
                        inProcess[j].push( process)
                        : inProcess[j] = [process]
                        promP = inProcess[j].reduce((before, now) =>  before += now) / inProcess[j].length
                        promP = Number(promP.toFixed(1))
                    }
                    log.debug(j,"promP " + promP)
                    /* Crear logica para los que estan en proceso! */
                    record.submitFields({
                        type: "customrecord_s4_sns_record_cat_f",
                        id: fatherId,
                        values: {
                                custrecord_s4_sns_prom_days: promT,
                            custrecord_s4_sns_users_more_ocp: max.trainee,
                            custrecord_s4_sns_users_less_ocp: min.trainee,
                            custrecord_s4_sns_prom_days_finish: promP,
                            custrecord_s4_sns_users_in_process: count[j] === undefined ? 0 : count[j].slice(-1)
                        },
                    })
                })
                
            }

        } catch (error) {
            log.error("error", error.message)
        }
    }

    return {
        execute: execute
    }
});
