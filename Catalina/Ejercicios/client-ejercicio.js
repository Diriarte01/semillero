/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Catalina R
 *@Puntuacion 78
 *fecha 28/02/2023
 */
define(['N/search', 'N/ui/dialog', "N/currentRecord"], function (search, dialog, currentRecord) {

    /**
     * @calificacion  20
     * @retro Buen Ejercicio, resulto de una manera simple
     * @consejo no era necesario el else, recuerda "Codigo chico codigo Bonito"
     */
    function pageInit(context) {
        const currentRecord = context.currentRecord
        if (context.mode === "create") {
            currentRecord.setValue({
                fieldId: "entity",
                value: 1665
            })
        } else {
            let listId = context.sublistId;
            log.debug("listId", listId)
            return;
        }
    }

    /**
     * @calificacion  20
     * @retro Buen Ejercicio, resulto de una manera simple
     * @consejo no era necesario el else, recuerda "Codigo chico codigo Bonito"
     */
    function saveRecord(context) {
        try {
            const currentRecord = context.currentRecord
            let num = currentRecord.getLineCount({
                sublistId: "item"
            })
            let view = {
                title: "alert",
                message: "la transacción debe tener como minimo 3 Lineas para guardarse"
            }
            log.debug("currentRecord", num < 3)
            if (num < 3) {
                dialog.alert(view);
                let sublistName = context.sublistId;
                log.debug("sublistName", sublistName)
                return false;
            } else {
                return true;
            }


        } catch (error) {
            log.error(error)
        }
    }


    /**
     * @calificacion  20
     * @retro Buen Ejercicio, resulto de una manera simple
     */
    function validateField(context) {
        
        const currentRecord = context.currentRecord;
        if (context.sublistId === "item" && context.fieldId === "quantity") {
            let quantity;
            quantity = currentRecord.getCurrentSublistValue({
                sublistId: "item",
                fieldId: "quantity",
            })
            if (quantity > 5) {
                let view = {
                    title: "alert",
                    message: "No se puede exceder de 5 articulos para agregar"
                }
                dialog.alert(view);
                currentRecord.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    value: 0,
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
        log.debug("context fieldchange", context);
        const currentRecord = context.currentRecord;
        let sublistId = context.sublistId;

        if(sublistId === "item") {
            let sublist = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: sublistId
            })
            let change = search.lookupFields({
            type: "inventoryitem",
            id: sublist,
            columns: ["costcategory"]
        
        })
    }}
    
    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        fieldChanged: fieldChanged
    }
});
