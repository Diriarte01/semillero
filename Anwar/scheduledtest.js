/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(["N/file", 'N/record'], function (file, record) {
  function execute(context) {
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
        if (cont == 0) {
          cont++;
          return true;
        } else {
          let res = line.value.split(";");
          if (dadtask.includes(res[0])) {
          } else {
            dadtask.push(res[0])
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
      dadtask.sort((a, b) => a - b)
      csv.sort((a, b) => a.tarea - b.tarea)
      let sonstaks = {}
      let task = {}
      for (let i = 0; i < dadtask.length; i++) {
        sonstaks = csv.filter(a => a.tarea === dadtask[i])
        task["Tarea" + dadtask[i]] = sonstaks
      }
      log.debug('tareas', task);

      task[0].forEach(obj => {
        const fechaCreate = obj["fechaCreate"];
        log.debug('fecha de creacion', fechaCreate);
      });




      /* task.forEach(obj => {
        
                let recordFather = record.create({
                  type: "customrecord_padre",
                  isDynamic: false,
                })
                recordFather.setValue({
                  fieldId: 'name',
                  value: task[0].tarea,
                })
                const saverecordFather = recordFather.save();
        
        log.debug("nombre", task[0].tarea);
        log.debug("limite", obj.length);


        task.Tarea1.forEach(element => {
          log.debug("entra");
        });
      }); */

    }
    catch (error) {
      log.debug('error', error.message);
    }
  }
  return {
    execute: execute
  }
});
