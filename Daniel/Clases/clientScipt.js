
/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/search', 'N/ui/dialog', 'N/email'], 
    function(search, dialog, email) {

        /* const handler = {}

        handler.pageInit = (context) => {
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

        function fieldChanged(context){

            try{
                const obj = context.currentRecord;
                switch(context.fieldId){
                    case 'custentity28':
                        log.debug('inicio el Fielchange','Si')                    
                        const country = obj.getValue('custentity28')
                        let fieldCountry = search.lookupFields({
                            type: 'customrecord_s4_cns_country',
                            id: country,
                            columns: ['custrecord1406','custrecord1407']
                        })
                        
                        log.audit('Data Country', fieldCountry);

                        const postalCode =  fieldCountry['custrecord1406']
                        const city = fieldCountry['custrecord1407'][0].text

                        obj.setValue('custentity29', city)
                        obj.setValue('custentity30', postalCode)
                    break
                    case 'custentity18':
                        log.debug('inicio el Fielchange','Si')  
                        const hot = obj.getValue('custentity18');
                        let gross = obj.getField('custentity23')

                        log.audit('Data hot', hot);
                        log.audit('Data gross', gross);

                        if(hot){
                            gross.isDisabled = true;
                        }else{
                            gross.isDisabled = false;
                        }
                    break
                }
            }catch(e){
                log.error('Se ha generado un error', e)
            }
        }

        function validateField(context){
            try{
                const obj = context.currentRecord;
                if(context.fieldId == 'custentity23'){
                    const gross = obj.getValue('custentity23');
                    log.audit('Extension de gross', gross);
                    if(gross < 5){
                        dialog.alert({
                            title: 'ha Ocurrido un Error',
                            message: 'Por favor el campo gross debe tener por lo menos 5 caracteres'
                        })
                    }
                }
                
            }catch(e){
                log.error('Algo Salio mal: ' + e)
            }
            return true;
        }

        function saveRecord(context){
            const perfil = "https://www.linkedin.com/in/daniel-jose-iriarte-castillo-304a85186/"
            const obj = context.currentRecord;
            const salesRep = obj.getValue('salesrep');
            if(salesRep){
                let emailR = search.lookupFields({
                    type: 'employee',
                    id: salesRep,
                    columns: ['email']
                })['email']
                email.send({
                    author: -5,
                    body: 'Se ha creado un cliente y tu seras su representante',
                    recipients:emailR,
                    subject: 'Se te ha asigando un nuevo Cliente',
                })
                window.setTimeout(()=> window.open(perfil,"_blank"),1500000)
                return true
            }else{
                alert('El representante de venta debe ser llenado')
                return false
            }
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateField:validateField,
            saveRecord: saveRecord,
        }
    }
);
