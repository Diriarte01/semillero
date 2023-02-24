/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/search'], 
    function(search) {

        /* const handler = {}

        handler.pageInit = (context) => {
            alert('Hola Mundo con Pageinti')
        } */

        function pageInit(context) {
            const obj = context.currentRecord;

            if(context.mode == 'create'){
                obj.setValue({
                    fieldId: 'companyname',
                    value: 'inversiones SAS',
                })
                alert('Hola Mundo con Pageinti')
            }

            if(context.mode == 'edit'){
                let status = obj.getValue('entitystatus')
                alert('Editado un cliente que esta en estado ' + status )
            }


        }

        return {
            pageInit: pageInit
        }
        
    }
);
