/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/task', 'N/https'], 
    function(serverWidget, task, https) {
        const handlers = {};

        const fields = {
            apiUrl : 'custpage_api_url',
            parameter: 'custpage_api_paramater',
            typePetition: 'custpage_api_type_petition',
            paramsText: 'custpage_api_params_text'
        }

        const parameters = [
            { text:'', value: '-1', isSelected: true },
            { text:'Productos', value: 'products', isSelected: false},
            { text:'Categorias', value: 'categories', isSelected: false},
            { text:'Usuarios', value: 'users', isSelected: false },
        ]

        const typesPetition = [
            { text:'', value: '-1', isSelected: true },
            { text:'Todo el registro', value: false, isSelected: false},
            { text:'Datos Especificos', value: true, isSelected: false}
        ]

        handlers.onRequest = (context) =>{
            const request = context.request
            const response = context.response
            const params = request.parameters

            const Form = serverWidget.createForm({ title: 'Consumo de API FAKE Platzi'});
            try{
                Form.clientScriptModulePath = './s4_sf_cs_api_fake.js';
                if(request.method === 'GET'){
                    Form.addSubmitButton({ label: 'Consumir api' })
                    const fldGroup = Form.addFieldGroup({ id: 'custpage_field_group', label: 'Información para la petición' })
                    const apiUrl = Form.addField({
                        id: fields.apiUrl,
                        label: 'Url API FAKE Platzi',
                        type: 'text',
                        container: 'custpage_field_group'
                    })
                    log.debug('api url: ', apiUrl)
                    apiUrl.defaultValue = 'https://api.escuelajs.co/api/v1/';
                    apiUrl.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE })

                    const parameter = Form.addField({
                        id: fields.parameter,
                        label: 'Parametro de Petición',
                        type: 'select',
                        container: 'custpage_field_group'
                    })
                    parameters.forEach(rs => parameter.addSelectOption({ value: rs.value, text: rs.text, isSelected: rs.isSelected }))
                    parameter.isMandatory = true
                    
                    const typePetition = Form.addField({
                        id: fields.typePetition,
                        label: 'Catalogo de Peticiónes',
                        type: 'select',
                        container: 'custpage_field_group'
                    })
                    typePetition.isMandatory = true
                    
                    typesPetition.forEach(rs => typePetition.addSelectOption({ value: rs.value, text: rs.text, isSelected: rs.isSelected }))
                    
                     
                    const paramsText = Form.addField({
                        id: fields.paramsText,
                        label: 'Parametro de texto',
                        type: 'text',
                        container: 'custpage_field_group'
                    })
                    paramsText.updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED })
                    paramsText.maxLength = 1
                }else{
                    Form.addButton({
                        id: 'custpage_bottom',
                        label: 'Inicio',
                        functionName: 'home()'
                    })
                    Form.title =  'Peticion exitosa'
                    let urlApi =  params[fields.apiUrl];
                    if(params[fields.typePetition] == 'true'){
                        urlApi += '/'+ params[fields.paramsText]
                    }
                    const httpsResponse = https.get({ url: urlApi })
                    log.debug('httpsResponse', httpsResponse.body)
                    const taskMap = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_s4_mr_fake_api',
                        deploymentId: 'customdeploy_s4_mr_fake_api',
                        params: {
                            'custscript_api'	: httpsResponse.body
                        }
                    })
                    const taskId = taskMap.submit()
                }
            }catch(e) {
                log.debug('Hubo un error en la ejecución', e)
            }finally{
                response.writePage(Form)
            }
        }

        return handlers
});
