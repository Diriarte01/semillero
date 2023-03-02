/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
*/
define([], function () {
    function pageInit(context) {
        const obj = context.currentRecord
        let customerId = "SeaHubs"
        if(context.mode == 'create'){
            obj.setValue({
                fieldId: 'companyname',
                value: customerId,
            })
            log.debug('Id del cliente seteato en pageInit')
        }
    }

    function saveRecord(context) {
        const obj = context.currentRecord
        if(context.mode == 'create' || context.mode == 'edit'){
            obj.getLineCount({
                sublistId: 'item'
            });
            if (lineCount < 3) {
              log.debug('La transacción debe tener como mínimo 3 líneas para guardarse');
              return false;
            }
          }
          return true;
    }

    function afterSubmit(context) {
      
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        afterSubmit: afterSubmit
    }
})