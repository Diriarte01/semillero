/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Catalina R
 *fecha 28/02/2023
 */
define(['N/search', 'N/ui/dialog', "N/currentRecord"], function (search, dialog, currentRecord) {

    function pageInit(context) {
        try {
            const record = context.currentRecord
            if (context.mode === "create") {
                record.setValue({
                    fieldId: "entity",
                    value: -1,
                })
            }
        } catch (error) {
            log.error(error)
        }
    }

    function saveRecord(context) {
        try {
            const record = context.currentRecord
            let num = record.getLineCount({
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

    function validateField(context) {
        const record = context.currentRecord;
        if (context.sublistId === "item" && context.fieldId === "quantity") {
            let quantity;
            quantity = record.getCurrentSublistValue({
                sublistId: "item",
                fieldId: "quantity",
            })
            if (quantity > 5) {
                let view = {
                    title: "alert",
                    message: "No se puede exceder de 5 articulos para agregar"
                }
                dialog.alert(view);
                record.setCurrentSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    value: 0,
                })
                return false;
            }
        }
        return true;
    }

    function fieldChanged(context) {
        const record = context.currentRecord;
        let sublistId = context.sublistId;

        if (sublistId === "item") {
            let sublist = record.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: sublistId,
            })
            if (sublist) {
                
                let change = search.lookupFields({
                    type: "inventoryitem",
                    id: sublist,
                    columns: ["costcategory"]
                })
                log.debug("sublist", typeof(sublist));
                change = change.costcategory;
                record.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: "description",
                    value: change,
                    ignoreFieldChange: true,
                })
            }
        }
    }

    function lineInit(contex) {

        const record = contex.currentRecord;
        let sublistId2 = contex.sublistId;
        log.debug("rsublist2", sublistId2)
        if (sublistId2 === "item") {
            record.setCurrentSublistValue({
                sublistId: sublistId2,
                fieldId: "quantity",
                value: 2,
                ignoreFieldChange: true,
                forceSyncSourcing: true
            })
        }
        log.debug("lineInit", contex);
        
    }
    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        fieldChanged: fieldChanged,
        lineInit: lineInit,
    }
});
