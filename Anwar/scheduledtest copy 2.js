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


      /* const filteredData = csvfileData.filter(w => w.tarea.includes(valueToSearch));
      filteredData.shift();
      log.debug('filteredData', filteredData); */

      /* filter.push(csvfileData.find(w => w.tarea.includes(valueToSearch)));
      log.debug('filter', filter); */

      let father = [];
      father.push(csvfileData.find(w => w.tarea.includes("1")));
      father.push(csvfileData.find(w => w.tarea.includes("2")));
      father.push(csvfileData.find(w => w.tarea.includes("3")));
      father.push(csvfileData.find(w => w.tarea.includes("4")));
      father.push(csvfileData.find(w => w.tarea.includes("5")));
      father.push(csvfileData.find(w => w.tarea.includes("6")));
      father.push(csvfileData.find(w => w.tarea.includes("7")));
      father.push(csvfileData.find(w => w.tarea.includes("8")));
      father.push(csvfileData.find(w => w.tarea.includes("9")));
      father.push(csvfileData.find(w => w.tarea.includes("10")));

      log.debug('filtered', father[0].tarea);

      //father

      let recordFather = record.create({
        type: "customrecord_padre",
        isDynamic: false,
      })

      recordFather.setValue({
        fieldId: 'name',
        value: father[0].tarea,
      })

      const saverecordFather = recordFather.save();
      log.debug("Se creó el contacto", saverecordFather);

    }
    catch (error) {
      log.debug('error', error.message);
    }
  }
  return {
    execute: execute
  }
});
