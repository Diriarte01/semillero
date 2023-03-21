/**
 *Ejercicio: 6
 *fecha: 08/03/2023
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 *@author León Basauri
 */
define(['N/file', 'N/record'], function (file, record) {

    function execute(context) {

        try {
            const csvFile = file.load({
                id: 4860
            })

            /* log.audit('contenido csv', csvFile) */

            let childs = [];
            let parents = {};

            /* Aquí creamos un objeto por cada hijo 
            dentro de un arreglo */
            csvFile.lines.iterator().each(function (line) {
                let w = line.value.split(";");
                childs.push({
                    task: w[0],
                    user: w[1],
                    desc: w[2],
                    dateCrea: w[3],
                    dateFin: w[4],
                    dateLim: w[5],
                    status: w[6]
                });
                return true;
            })
            childs.shift(); //Para quitar la línea de encabezados, que no nos sirve

            /* log.debug('csv parseado', childs) */

            /* Aquí creamos un objeto que contenga dentro de sí los 
            objetos padres (parents) anidados. Y entro de cada padre,
            habrá un arreglo que contenga todos sus objetos hijos correspondientes */
            childs.forEach(child => {
                if (!parents.hasOwnProperty("task " + child.task)) {
                    parents["task " + child.task] = [child]
                } else {
                    parents["task " + child.task].push(child)
                }
            });

            /* log.debug('paes', parents) */



            const parseDate = (a) => {
                let date = a.split("/")
                let convertDate = new Date(date[1] + "/" + date[0] + "/" + date[2])
                return convertDate
            }
            /* Declaración de variables que servirán 
                        en el doble for de abajo */
            let cont = 0;
            let cont2 = 0;
            let daysConsumed = 0
            let daysConsumedTotal = 0
            let daysLeft = 0;
            let daysLeftTotal = 0;
            let mostDays = 0;
            let mostDaysUser = "";
            let mostDaysUsers = {};
            let fewestDays = 100;
            let fewestDaysUser = "";
            let fewestDaysUsers = {};
            let days_avg = 0;
            let daysLeft_avg = 0;


            /*  Con el for...in recorremos los objetos (parents), 
            y dentro de cada parent hay un arreglo de childs
            que contiene la información que proceseramos en cada
            vuelta del forEach*/
            for (let prop in parents) {
                log.debug('prop', prop)

                const parentObj = record.create({
                    type: "customrecord_s4_sns_rec_leon_pa",
                })

                parentObj.setValue({
                    fieldId: "name",
                    value: prop
                })
                let parentSave = parentObj.save()

                parents[prop].forEach(child => {
                    let dateCreaPars = parseDate(child.dateCrea).getTime() / (1000 * 60 * 60 * 24);
                    let dateFinPars = parseDate(child.dateFin).getTime() / (1000 * 60 * 60 * 24);
                    let dateLimPars = parseDate(child.dateLim).getTime() / (1000 * 60 * 60 * 24);
                    if (child.status === "Terminado") {
                        daysConsumed = dateFinPars - dateCreaPars;
                        daysConsumedTotal += daysConsumed;
                        cont++;

                        if (daysConsumed >= mostDays) {
                            mostDaysUser = child.user;
                            mostDays = daysConsumed;

                            if (!mostDaysUsers.hasOwnProperty("task " + child.task)) {
                                mostDaysUsers["task " + child.task] = [mostDaysUser]
                            } else {
                                mostDaysUsers["task " + child.task].push(mostDaysUser)
                            }
                        }

                        if (daysConsumed <= fewestDays) {
                            fewestDaysUser = child.user;
                            fewestDays = daysConsumed;

                            if (!fewestDaysUsers.hasOwnProperty("task " + child.task)) {
                                fewestDaysUsers["task " + child.task] = [fewestDaysUser]
                            } else {
                                fewestDaysUsers["task " + child.task].push(fewestDaysUser)
                            }
                        }
                    }

                    else {
                        daysLeft = dateLimPars - dateFinPars
                        daysLeftTotal += daysLeft;
                        cont2++;
                    }

                    const childObj = record.create({
                        type: "customrecord_s4_sns_rec_leon_ch",
                    })

                    childObj.setValue({
                        fieldId: "name",
                        value: child.user
                    })
                    let childSave = childObj.save()

                    record.submitFields({
                        type: "customrecord_s4_sns_rec_leon_ch",
                        id: childSave,
                        values: {
                            custrecord_s4_sns_desc: child.desc,
                            custrecord_s4_sns_creation_date: child.dateCrea,
                            custrecord_s4_sns_finish_date: child.dateFin,
                            custrecord_s4_sns_limit_date: child.dateLim,
                            custrecord_s4_sns_task_status: child.status,
                            custrecord_s4_sns_task_num: parentSave
                        }
                    })
                })

                /* {
                                task:7,
                                user: "user 1",
                                desc: "Descripcion 1",
                                dateCrea: "5/03/2023",
                                dateFin: "8/03/2023",
                                dateLim: "10/03/2023",
                                status: "Terminado"
                             } */


                mostDays = 0;
                fewestDays = 100;


                days_avg = daysConsumedTotal / cont;
                daysLeft_avg = daysLeftTotal / cont2;

                log.debug('usuarios menos días', fewestDaysUsers)
                log.debug('usuarios más días', mostDaysUsers)
                log.debug('promedio consumidos', days_avg)
                log.debug('prom días que quedan', daysLeft_avg)


                record.submitFields({
                    type: "customrecord_s4_sns_rec_leon_pa",
                    id: parentSave,
                    values: {
                        custrecord_s4_sns_days_avg: days_avg,
                        custrecord_s4_sns_daysleft_avg: daysLeft_avg,
                        custrecord_s4_sns_fewestdays: fewestDaysUsers[prop].slice(-1),
                        custrecord_s4_sns_mostdays: mostDaysUsers[prop].slice(-1),
                        custrecord_s4_sns_process: cont2
                    },
                })


            }











        }

        catch (e) {
            log.error('Hubo un error en la ejecución', e.message)
        }

    }

    return {
        execute: execute
    }
});
