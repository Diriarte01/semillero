/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(["N/file", 'N/record'], function (file, record) {
  function execute(context) {
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
      const valoresUnicos = {};
      csvfileData.forEach(objeto => {
        const primerValor = objeto.tarea;
        if (!valoresUnicos[primerValor]) {
          valoresUnicos[primerValor] = true;
        }
      });
      const cantidadValoresUnicos = Object.keys(valoresUnicos).length;
      let father = [];
      for (let i = 0; i < cantidadValoresUnicos; i++) {
        father.push(csvfileData.find(w => w.tarea.includes(i)));
      }
      for (let i = 0; i < cantidadValoresUnicos; i++) {
        
        let recordFather = record.create({
          type: "customrecord_padre",
          isDynamic: false,
        })
        recordFather.setValue({
          fieldId: 'name',
          value: father[i].tarea,
        })
        const saverecordFather = recordFather.save();
        log.debug("Se creó el registro padre", saverecordFather);

        for (let y = 0; y < csvfileData.length; y++) {
          if (csvfileData[y].tarea == i + 1) {
            let recordChild = record.create({
              type: "customrecord139",
              isDynamic: false,
            })
            recordChild.setValue({
              fieldId: 'name',
              value: csvfileData[y].tarea,
            })
            recordChild.setValue({
              fieldId: 'custrecord_s4_sns_link',
              value: saverecordFather,
            })
            const saverecordChild = recordChild.save();
            log.debug("Se creó el registro hijo", saverecordChild);
          }
        }
      }
    }
    catch (error) {
      log.debug('error', error.message);
    }
  }
  return {
    execute: execute
  }
});
