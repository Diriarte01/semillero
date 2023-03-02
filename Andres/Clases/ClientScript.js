/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/search','N/ui/dialog'], function(search,dialog) {


    function fieldChanged(context) {
        
        try {
            const currentRecord = context.currentRecord;
            switch (context.fieldId) {
                case 'custentity8':
                   
                    let country = currentRecord.getValue({
                        fieldId: 'custentity8'
                    })
                    
                    let listcountry = search.lookupFields({
                        type: 'customrecord_s4_cns_country',
                        id: country,
                        columns: ['custrecord134','custrecord135']
                    })
                
                    let postalCode = listcountry['custrecord134'];
                    let city = listcountry['custrecord135'][0].text;
                
                    currentRecord.setValue({
                        fieldId: 'custentity_s4_cns_capital',
                        value: city,
                    })
                    currentRecord.setValue({
                        fieldId: 'custentity_s4_cns_postal_code',
                        value: postalCode,
                    })

                    
                    break;
                case 'custentity_s4_nxc_hot_lead':

                    let hotLead = currentRecord.getValue({
                        fieldId: 'custentity_s4_nxc_hot_lead'
                    })
                    if(hotLead){
                        currentRecord.getField('custentity_lead_category').isDisabled = true;
                        log.audit({
                            title: 'country',
                            details: city
                        })
                    }else{
                        currentRecord.getField('custentity_lead_category').isDisabled = false;
                    }
                    break;
                
                default:
                    break;
            }
            
        } catch (error) {
            log.error({
                title: 'error',
                details: error
            })
        }
    }

    function validateField(context){
        try {
            const currentRecord = context.currentRecord;
            log.audit({
                title: 'entra',
                details: "si"
            })
            if(context.fieldId == 'altphone'){
                let phone = currentRecord.getValue({
                    fieldId: 'altphone'
                })

                if(phone >= 8){
                    dialog.alert({
                        title: "error",
                        message: "Este campo solo acepta 7 numeros"
                    })
                }
            }
        } catch (error) {
            log.error('algo salio mas' + error);
        }
        return  true;


        /*
             try {
            const obj = context.currentRecord;
            let subLista = context.sublistId;//Traemos el ID de la lista
            
            if( subLista === "item"){//comprobamos que sea la Lista que queremos Articulos("item")
                  let lineaValue = obj.getCurrentSublistValue({
                        sublistId: subLista,
                        fieldId: 'quantity',
                    })//con esta funcion traemos la linea que acabamos de crear
                    if(lineaValue > 5){

                        dialog.alert({
                            title: "Articulos Maximos",
                            message: "No se pueden agregar mas de 5 unidades por articulo"
                        })
                        log.audit('hola',lineaValue)
                    }   
                    return false;  
            }
        } catch (error) {
            log.error({
                title: "error",
                details: error
            })
        }
        return true;
    }
        */
    }

    return {
        fieldChanged: fieldChanged,
        validateField: validateField,
    }

});
