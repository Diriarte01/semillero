/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(['N/file', 'N/record'], function (file, record) {

    const parseDate = (a) => {
        let date = a.split("/")
        let convertDate = new Date(date[1] + "/" + date[0] + "/" + date[2])
        return convertDate
    }


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




    function getInputData() {
        try {
            const csvFile = file.load({
                id: 4860
            })


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


            childs.forEach(child => {
                if (!parents.hasOwnProperty("task " + child.task)) {
                    parents["task " + child.task] = [child]
                } else {
                    parents["task " + child.task].push(child)
                }
            });


            return parents;


        } catch (error) {
            log.error('Hubo un error en la ejecución', e.message)
        }


    }

    function map(context) {

        /* log.debug('context', context) */
        let parent = JSON.parse(context.value);

        /* log.debug('parent', parent) */
        let parentKey = context.key;

        const parentObj = record.create({
            type: "customrecord_s4_sns_rec_leon_pa",
        })

        parentObj.setValue({
            fieldId: "name",
            value: parentKey
        })
        let parentSave = parentObj.save()



        try {
            parent.forEach(child => {

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


            }) //final del for



            mostDays = 0;
            fewestDays = 100;
            
            /* ANALIZAR!!!
            cont = 0;
            cont2 = 0; */


            days_avg = (daysConsumedTotal / cont).toFixed(2);
            daysLeft_avg = (daysLeftTotal / cont2).toFixed(2);

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
                    custrecord_s4_sns_fewestdays: fewestDaysUsers[parentKey].slice(-1),
                    custrecord_s4_sns_mostdays: mostDaysUsers[parentKey].slice(-1),
                    custrecord_s4_sns_process: cont2
                },
            })
        }

        catch (e) {
            log.error('Hubo un error en la ejecución', e.message)
        }


    }

    function reduce(context) {

    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});




/* //CONTEXT
{
    type: "mapreduce.MapContext",
    isRestarted: false,
    executionNo: 1,
    key: "task 7",
    value: "[{"task":"7","user":"user 1","desc":"Descripcion 1","dateCrea":"5/03/2023","dateFin":"8/03/2023","dateLim":"10/03/2023","status":"Terminado"},{"task":"7","user":"user 3","desc":"Descripcion 3","dateCrea":"1/03/2023","dateFin":"9/03/2023","dateLim":"11/03/2023","status":"Proceso"},{"task":"7","user":"user 4","desc":"Descripcion 4","dateCrea":"5/03/2023","dateFin":"8/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 8","desc":"Descripcion 8","dateCrea":"2/03/2023","dateFin":"9/03/2023","dateLim":"10/03/2023","status":"Proceso"},{"task":"7","user":"user 13","desc":"Descripcion 13","dateCrea":"2/03/2023","dateFin":"9/03/2023","dateLim":"11/03/2023","status":"Proceso"},{"task":"7","user":"user 14","desc":"Descripcion 14","dateCrea":"5/03/2023","dateFin":"8/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 26","desc":"Descripcion 26","dateCrea":"4/03/2023","dateFin":"7/03/2023","dateLim":"9/03/2023","status":"Terminado"},{"task":"7","user":"user 41","desc":"Descripcion 41","dateCrea":"2/03/2023","dateFin":"8/03/2023","dateLim":"9/03/2023","status":"Terminado"},{"task":"7","user":"user 44","desc":"Descripcion 44","dateCrea":"1/03/2023","dateFin":"9/03/2023","dateLim":"9/03/2023","status":"Proceso"},{"task":"7","user":"user 52","desc":"Descripcion 52","dateCrea":"3/03/2023","dateFin":"7/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 54","desc":"Descripcion 54","dateCrea":"1/03/2023","dateFin":"9/03/2023","dateLim":"11/03/2023","status":"Proceso"},{"task":"7","user":"user 58","desc":"Descripcion 58","dateCrea":"4/03/2023","dateFin":"8/03/2023","dateLim":"10/03/2023","status":"Terminado"},{"task":"7","user":"user 59","desc":"Descripcion 59","dateCrea":"5/03/2023","dateFin":"7/03/2023","dateLim":"9/03/2023","status":"Terminado"},{"task":"7","user":"user 63","desc":"Descripcion 63","dateCrea":"4/03/2023","dateFin":"8/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 70","desc":"Descripcion 70","dateCrea":"4/03/2023","dateFin":"7/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 71","desc":"Descripcion 71","dateCrea":"1/03/2023","dateFin":"8/03/2023","dateLim":"10/03/2023","status":"Terminado"},{"task":"7","user":"user 73","desc":"Descripcion 73","dateCrea":"4/03/2023","dateFin":"9/03/2023","dateLim":"9/03/2023","status":"Proceso"},{"task":"7","user":"user 86","desc":"Descripcion 86","dateCrea":"5/03/2023","dateFin":"7/03/2023","dateLim":"11/03/2023","status":"Terminado"},{"task":"7","user":"user 93","desc":"Descripcion 93","dateCrea":"4/03/2023","dateFin":"7/03/2023","dateLim":"10/03/2023","status":"Terminado"},{"task":"7","user":"user 99","desc":"Descripcion 99","dateCrea":"4/03/2023","dateFin":"8/03/2023","dateLim":"9/03/2023","status":"Terminado"}]"
 }


//parent

[
    {
       task:9,
       user: "user 11",
       desc: "Descripcion 11",
       dateCrea: "1/03/2023",
       dateFin: "7/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 17",
       desc: "Descripcion 17",
       dateCrea: "1/03/2023",
       dateFin: "7/03/2023",
       dateLim: "9/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 22",
       desc: "Descripcion 22",
       dateCrea: "5/03/2023",
       dateFin: "7/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 23",
       desc: "Descripcion 23",
       dateCrea: "2/03/2023",
       dateFin: "8/03/2023",
       dateLim: "9/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 24",
       desc: "Descripcion 24",
       dateCrea: "1/03/2023",
       dateFin: "8/03/2023",
       dateLim: "10/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 31",
       desc: "Descripcion 31",
       dateCrea: "5/03/2023",
       dateFin: "9/03/2023",
       dateLim: "11/03/2023",
       status: "Proceso"
    },
    {
       task:9,
       user: "user 33",
       desc: "Descripcion 33",
       dateCrea: "4/03/2023",
       dateFin: "8/03/2023",
       dateLim: "9/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 37",
       desc: "Descripcion 37",
       dateCrea: "5/03/2023",
       dateFin: "8/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 45",
       desc: "Descripcion 45",
       dateCrea: "3/03/2023",
       dateFin: "9/03/2023",
       dateLim: "10/03/2023",
       status: "Proceso"
    },
    {
       task:9,
       user: "user 49",
       desc: "Descripcion 49",
       dateCrea: "3/03/2023",
       dateFin: "8/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 55",
       desc: "Descripcion 55",
       dateCrea: "1/03/2023",
       dateFin: "7/03/2023",
       dateLim: "10/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 69",
       desc: "Descripcion 69",
       dateCrea: "1/03/2023",
       dateFin: "7/03/2023",
       dateLim: "9/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 88",
       desc: "Descripcion 88",
       dateCrea: "1/03/2023",
       dateFin: "8/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    },
    {
       task:9,
       user: "user 91",
       desc: "Descripcion 91",
       dateCrea: "5/03/2023",
       dateFin: "7/03/2023",
       dateLim: "11/03/2023",
       status: "Terminado"
    }
 ] */