/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@Puntuacion 98
 *
 */
define(['N/ui/dialog', 'N/search'], function (dialog, search) {

    /**
     * 
     * @calificacion = 20
     * @retro = Buen Ejercicio, resulto de una manera simple
     */
    function pageInit(context) {
        const obj = context.currentRecord;
        if (context.mode !== 'create')
            return;
        obj.setValue({
            fieldId: 'entity',
            value: 1690
        });

    }


    /**
     * 
     * @calificacion = 20
     * @retro = Buen Ejercicio, resulto de una manera simple
     */
    function saveRecord(context) {
        const obj = context.currentRecord;
        let lines = obj.getLineCount({ // Esta variable solo es asignada una sola vez, la mejor practica es que la declararas con Const
            sublistId: 'item'
        })
        if (lines < 3) {
            dialog.alert({
                title: "Articulos Minimos requeridos",
                message: "La transacción debe tener como minimo 3 articulos para poder Guardar"
            })
            return false;
        }

        return true;
    }

    /**
     * 
     * @calificacion  20
     * @retro  Buen Ejercicio, resulto de una manera simple
     * @consejo Delimita la sublista que vas a validar, en este caso solo existe un campo cantidad en otros registro hay varios y pueden activar la secuencia de comandos
     */
    function validateField(context) {
        let obj = context.currentRecord;
        let sublistName = context.sublistId;
        let sublistFieldName = context.fieldId;
        if (sublistFieldName === 'quantity') {
            let items = obj.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: sublistFieldName
            })
            if (items >= 5) {
                dialog.alert({
                    title: "Articulos Maximos",
                    message: "No se pueden agregar mas de 5 unidades por articulo"
                })
                obj.setCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'quantity',
                    value: 1,
                    ignoreFieldChange: true,
                    forceSyncSourcing: true
                })
                return false;
            }
        }

        return true;
    }


    /**
     * 
     * @calificacion = 18
     * @retro = Buen Ejercicio, si cumple con la funcionalidad pero se ejecuta muchas veces
     *          solo deberia ejecutarse cuando modificamos o introducimos algo al campo item
     */
    function fieldChanged(context) {
        try {
            let obj = context.currentRecord;
            let sublistName = context.sublistId;

            if (sublistName === "item") {
                /* if (context.sublistId == 'item') {  con esta linea solucionabas la ejecucion multiple*/
                    let item = obj.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: sublistName,
                    })
                    let searchitem = search.lookupFields({
                        type: 'inventoryitem',
                        id: item,
                        columns: ['costcategory']
                    })

                    let costcategory = searchitem['costcategory']

                    obj.setCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'description',
                        value: costcategory,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    })
                    log.audit("hello", item + " " + costcategory)
                /* } */
            }
            return true;
        } catch (error) {

        }
    }

    function postSourcing(context) {

    }


    /**
     * 
     * @calificacion = 20
     * @retro = Buen Ejercicio, resulto de una manera simple
     */
    function lineInit(context) {
        let obj = context.currentRecord;
        let sublistName = context.sublistId;
        if (sublistName === 'item') {
            obj.setCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'quantity',
                value: 2,
                ignoreFieldChange: true,
                forceSyncSourcing: true
            })
        }
        return true;
    }

    function validateDelete(context) {

    }

    function validateInsert(context) {

    }

    function validateLine(context) {

    }

    function sublistChanged(context) {

    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        fieldChanged: fieldChanged,
        lineInit: lineInit,
    }
});
