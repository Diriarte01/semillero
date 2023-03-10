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

      const filteredData = csvfileData.filter(w => w.tarea.includes(valueToSearch));
      filteredData.shift();
      log.debug('filteredData', filteredData);




      // creando los records
      for (let i = 0; i < cantidadValoresUnicos; i++) {

        /*         let recordFather = record.create({
                  type: "customrecord_padre",
                  isDynamic: false,
                })
        
                recordFather.setValue({
                  fieldId: 'name',
                  value: father[i].tarea,
                })
        
                const saverecordFather = recordFather.save();
                log.debug("Se creó el registro padre", saverecordFather);
         */
        log.debug("Se creó el registro padre");

      }

      for (let i = 0; i < csvfileData.length; i++) {

        let recordchild = record.create({
          type: "customrecord139",
          isDynamic: false,
        })

        recordchild.setValue({
          fieldId: 'name',
          value: csvfileData[i].tarea,
        })

        recordchild.setValue({
          fieldId: 'name',
          value: csvfileData[i].tarea,
        })

        const saverecordchild = recordFather.save();
        log.debug("Se creó el registro hijo", saverecordchild);

      }







      /* 
      //creando los records padre

      let recordFather = record.create({
        type: "customrecord_padre",
        isDynamic: false,
      })

      recordFather.setValue({
        fieldId: 'name',
        value: father[0].tarea,
      })

      const saverecordFather = recordFather.save();
      log.debug("Se creó el registro padre", saverecordFather);

      //creando los records hijo

      let recordchild = record.create({
        type: "customrecord139",
        isDynamic: false,
      })

      recordchild.setValue({
        fieldId: 'name',
        value: father[0].tarea,
      })

      const saverecordchild = recordFather.save();
      log.debug("Se creó el registro hijo", saverecordchild);
      */

    }
    catch (error) {
      log.debug('error', error.message);
    }
  }
  return {
    execute: execute
  }
});
