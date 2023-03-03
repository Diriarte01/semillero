/**
 *Nombre: Leon Basauri
 *Ejercicio: 2
 *fecha: 01/03/2023
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */

define(['N/ui/message', 'N/ui/dialog'], function (message, dialog) {

    function pageInit(context) {
        try {
            const obj = context.currentRecord;
            log.audit('context currentRecord', context.currentRecord);
            if (context.mode == 'create') {
                obj.setValue({
                    fieldId: 'entity',
                    value: '1691'
                })
                alert('Hola Papu')
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
        let sublista = context.sublistId;
        let sublistFieldName = context.fieldId;

        if (sublista === 'item' && sublistFieldName === 'quantity') {
            let quant = obj.getCurrentSublistValue({
                sublistId: sublista,
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

    }



    function sublistChanged(context) {
        try {
            let obj = context.currentRecord;
            let sublista = context.sublistId;

            if (sublista === "item") {
                let searchItem = search.lookupFields({
                    type: 'inventoryitem',
                    id: sublista,
                    columns: ['costcategory']
                })

                let category = searchItem['costcategory']

                obj.setValue({
                    fieldId: 'description',
                    value: category
                })

            }
        }
        catch (e) {
            log.error('Se ha generado un error', e)
        }
    }


    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        lineInit: lineInit,
        sublistChanged: sublistChanged
    }
});
