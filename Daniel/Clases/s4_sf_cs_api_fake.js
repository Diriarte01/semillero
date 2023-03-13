/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/ui/dialog', 'N/url'], 
    function(dialog, url) {

        const fields = {
            apiUrl : 'custpage_api_url',
            parameter: 'custpage_api_paramater',
            typePetition: 'custpage_api_type_petition',
            paramsText: 'custpage_api_params_text'
        }

        const handlers = {};
       
        handlers.fieldChanged = (context)=>{
            const obj = context.currentRecord;
            const fieldId =  context.fieldId;
            try{
                if(fieldId != null){
                    const fieldValue = obj.getValue(fieldId);
                    switch(fieldId){
                        case fields.typePetition :
                            const fieldProperty = obj.getField(fields.paramsText);
                            if(fieldValue == 'true'){
                                fieldProperty.isDisabled = false;
                                fieldProperty.isMandatory = true;
                            }else{
                                fieldProperty.isDisabled = true;
                                fieldProperty.isMandatory = false;
                                obj.setValue(fields.paramsText, ' ')
                            }
                        break;
                        case fields.parameter:
                            const domainApi = 'https://api.escuelajs.co/api/v1/';
                            obj.setValue(fields.apiUrl, domainApi + fieldValue)
                        break
                    }
                }
            }catch(e){
                console.log('Hubo un error', e)
            }
        }

        handlers.validateField = (context)=>{
            try{
                const obj = context.currentRecord;
                const fieldId =  context.fieldId;
                if(fieldId && fieldId == fields.paramsText){
                    const fieldValue = Number(obj.getValue(fieldId));
                    if( isNaN(fieldValue) || typeof fieldValue != 'number'){
                        dialog.alert({
                            title: 'Error',
                            message: 'En este campo solo se aceptan numeros Enteros'
                        })
                    }
                }
                return true;
            }catch(e){
                console.log('Hubo un erorr',e )
            }
        }

        handlers.home = ()=>{
            const urlSs = url.resolveScript({
                deploymentId: 'customdeploy_s4_ss_api_fake_platzi',
                scriptId: 'customscript_s4_ss_api_fake_platzi',
            })
            window.location.replace(urlSs)
        }
        return handlers
        
    }
);
