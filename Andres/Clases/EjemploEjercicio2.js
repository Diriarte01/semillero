/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/ui/dialog','N/search'], function(dialog,search) {
    
    function pageInit(context) {
       const obj = context.currentRecord;
        if (context.mode !== 'create')
                return;
        obj.setValue({
            fieldId: 'entity',
            value: 1690
        });
        
    }

    function saveRecord(context) {
        const obj = context.currentRecord;
        let lines = obj.getLineCount({
            sublistId: 'item'
        }) 
        if(lines < 3){
            dialog.alert({
                title: "Articulos Minimos requeridos",
                message: "La transacción debe tener como minimo 3 articulos para poder Guardar"
            })
            return false;
        }
        

        return true;
    }

    function validateField(context) {
        let obj = context.currentRecord;
        let sublistName = 'item'
        let sublistFieldName = 'quantity';
        let line = context.line;    
        if (sublistFieldName === 'quantity') {
                let items = obj.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: sublistFieldName
                })
                
                if (items >= 5){
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

    function fieldChanged(context) {
        try {
            let obj = context.currentRecord;
            let sublistName = context.sublistId;    

            if(sublistName === "item"){
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
                log.audit("hello", item+" "+costcategory)
            }
            return true;
        } catch (error) {
           
        }
    }

    function postSourcing(context) {
        
    }

    function lineInit(context) {
        let obj = context.currentRecord;
        let sublistName = context.sublistId;
        if(sublistName === 'item'){
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
        let obj = context.currentRecord;
        let sublistName = context.sublistId;    

        if(sublistName === "item"){
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
            log.audit("hello", item+" "+costcategory)
        }
        return true;
    }

    function sublistChanged(context) {
        let obj = context.currentRecord;
        let sublistName = context.sublistId;    

        if(sublistName === "item"){
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
            log.audit("hello", item+" "+costcategory)
        }
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        validateField: validateField,
        //sublistChanged: sublistChanged,
        //validateLine: validateLine,
        fieldChanged: fieldChanged,
        lineInit: lineInit,
    }
});
