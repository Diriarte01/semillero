/**
 *Nombre: Leon Basauri
 *Ejercicio: 2
 *fecha: 01/03/2023
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */

define(['N/ui/message', 'N/ui/dialog', 'N/search'], function (message, dialog, search) {

    function pageInit(context) {
        try {
            const obj = context.currentRecord;
            log.audit('context currentRecord', context.currentRecord);
            if (context.mode == 'create') {
                obj.setValue({
                    fieldId: 'entity',
                    value: '1691'
                })

            }
        }
        catch (e) {
            log.error('Se ha generado un error', e)
        }
    }

    function saveRecord(context) {

        try {
            const obj = context.currentRecord;
            let lines = obj.getLineCount({
                sublistId: 'item'
            })
            let myMsg = message.create({
                title: "Ups! Cantidad de Artículos insuficiente",
                message: "La transacción debe tener como minimo 3 líneas para guardarse",
                type: message.Type.ERROR
            });

            if (lines < 3) {
                myMsg.show();
                return false;
            }
            return true;
        }
        catch (e) {
            log.error('Se ha generado un error', e)
        }

    }




    function validateField(context) {

        const obj = context.currentRecord;
        let sublist = context.sublistId;
        let sublistFieldName = context.fieldId;

        if (sublist === 'item' && sublistFieldName === 'quantity') {
            let quant = obj.getCurrentSublistValue({
                sublistId: sublist,
                fieldId: sublistFieldName
            });
            if (quant > 5) {
                dialog.alert({
                    title: 'Ha ocurrido un Error',
                    message: 'El campo Cantidad no puede ser mayor a 5'
                })
            }
        }
        return true;

    }


    function lineInit(context) {
        let obj = context.currentRecord;
        let sublist = context.sublistId;
        if (sublist === 'item') {
            obj.setCurrentSublistValue({
                sublistId: sublist,
                fieldId: 'quantity',
                value: 2,
                ignoreFieldChange: true,
            })
        }
        return true;
    }



    // function fieldChanged(context) {
    //     try {
    //         let obj = context.currentRecord;
    //         let sublist = context.sublistId;
    //         log.audit('id de sublist', sublist);

    //         if (sublist === "item") {
    //             let item = obj.getCurrentSublistValue({
    //                 sublistId: sublist,
    //                 fieldId: sublist,
    //             })
    //             log.audit('variable item', item);

    //             let searchItem = search.lookupFields({
    //                 type: 'inventoryitem',
    //                 id: item,
    //                 columns: ['costcategory']
    //             })

    //             log.audit('variable searchItem', searchItem);
    //             let category = searchItem['costcategory']

    //             obj.setCurrentSublistValue({
    //                 sublistId: sublist,
    //                 fieldId: 'description',
    //                 value: category,
    //                 ignoreFieldChange: true,
    //             })

    //         }
    //         return true
    //     }
    //     catch (e) {
    //         log.error('Se ha generado un error', e)
    //     }
    // }


    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        lineInit: lineInit,
      
    }
});
