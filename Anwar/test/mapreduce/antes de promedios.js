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

      //log.debug("maindata", csvfileData);
      //log.debug("dates", csvfileData[0].fechac);

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
          let ffechac;
          let ffechat;
          let ffechal;

          if (csvfileData[y].tarea == i) {

            const tfechac = csvfileData[y].fechac.split('/');
            const tfechat = csvfileData[y].fechat.split('/');
            const tfechal = csvfileData[y].fechal.split('/');

            ffechac = (tfechac[1] + '/' + tfechac[0] + '/' + tfechac[2]);
            ffechat = (tfechat[1] + '/' + tfechat[0] + '/' + tfechat[2]);
            ffechal = (tfechal[1] + '/' + tfechal[0] + '/' + tfechal[2]);

            let recordChild = record.create({
              type: "customrecord139",
              isDynamic: false,
            })
            recordChild.setValue({
              fieldId: 'name',
              value: csvfileData[y].tarea,
            })
            recordChild.setValue({
              fieldId: 'custrecord_s4_sns_user_name',
              value: csvfileData[y].practicante,
            })
            recordChild.setValue({
              fieldId: 'custrecord_descripcion',
              value: csvfileData[y].descripcion,
            })
            //fechas
            recordChild.setValue({
              fieldId: 'custrecord_start_date',
              value: ffechac,
            })
            recordChild.setValue({
              fieldId: 'custrecord_end_date',
              value: ffechat,
            })
            recordChild.setValue({
              fieldId: 'custrecord_s4_sns_fechal',
              value: ffechal,
            })
            //fechas
            recordChild.setValue({
              fieldId: 'custrecord_s4_sns_status',
              value: csvfileData[y].estado,
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
