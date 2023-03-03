/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
*/
define([], function () {

    function pageInit(context) {
        const obj = context.currentRecord;
        let id = "SeaHubs"
        if (context.mode == 'create')
            obj.setValue({
                fieldId: 'entityId',
                value: 1690
            });
        log.debug("Valor Seteado")

    }

    function saveRecord(context) {
        const obj = context.currentRecord
        let lineCount = obj.getLineCount({
            sublistId: 'item'
        });
        if (lineCount < 3) {
            log.debug('La transacción debe tener como mínimo 3 líneas para guardarse');
            alert('La transacción debe tener como mínimo 3 líneas para guardarse')
            return false;
        }
        return true;
    }

    function validateField(context) {
        const obj = context.currentRecord;
        let sublistId = context.sublistId
        let sublistName = context.sublistName

        let lineCount = obj.getCurrentSublistValue({
            sublistId: sublista,
            fieldId: sublistName
        });

        if (sublistId == 'item' || sublistId == 'quantity') {
            if (lineCount > 5) {
                log.debug('La transacción debe tener como maximo 5 unidades');
                alert('La transacción debe tener como maximo 5 unidades')
                return false;
            }
            return true;
        }
    }

    function fieldChanged(context) {
        if (context.fieldId === 'item') {
            let obj = context.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });
        }
        log.debug("valor seteado")
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        fieldChanged: fieldChanged
    }
})