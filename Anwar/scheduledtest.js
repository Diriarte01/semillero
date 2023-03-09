/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(["N/file"], function (file) {
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


      //log.debug('datos', csvfileData[0].tarea);
      log.debug('datos', csvfileData);


    } catch (error) {
      log.debug('error', error.message);
    }
  }

  return {
    execute: execute
  }
});
