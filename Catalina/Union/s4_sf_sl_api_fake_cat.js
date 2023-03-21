/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/task', 'N/https'],
    function (serverWidget, task, https) {
        const handlers = {};

        /* creamos un objeto que nos almacenará los nombre de los campos que vamos a agregar */
        const fields = {
            apiUrl: 'custpage_api_url',
            parameter: 'custpage_api_paramater',
            typePetition: 'custpage_api_type_petition',
            paramsText: 'custpage_api_params_text'
        }
        /* Nos almacena datos para crear posterior el select */
        const parameters = [
            { text: '', value: '-1', isSelected: true },
            { text: 'Productos', value: 'products', isSelected: false },
            { text: 'Categorias', value: 'categories', isSelected: false },
            { text: 'Usuarios', value: 'users', isSelected: false },
        ]

        const typesPetition = [
            { text: '', value: '-1', isSelected: true },
            { text: 'Todo el registro', value: false, isSelected: false },
            { text: 'Datos Especificos', value: true, isSelected: false }
        ]

        handlers.onRequest = (context) => {
            const request = context.request
            const response = context.response
            const params = request.parameters
            /* Aqui creamos el formulario */
            const Form = serverWidget.createForm({ title: 'Consumo de API FAKE Platzi' });
            try {
                /* Llamamos al script del client, este se nos ejecutará dependiendo de lo
                creado en dicho script, este al ser un fieldChange unicamente me cambiara, si esta habilitado o no
                el campo que escogi */
                Form.clientScriptModulePath = "./s4_sf_cl_test_union_cat.js";
                if (request.method === 'GET') {
                    /* Creamos el boton por defecto que tiene el serverWidget
                    para rediteccionar al POST del suitelet
                    */
                    Form.addSubmitButton({ label: 'Consumir api' })
                    /* Agregamos un grupo de campos */
                    const fldGroup = Form.addFieldGroup({ id: 'custpage_field_group', label: 'Información para la petición' })
                    /* creamos campos, dentro del contenedor anteriormente creado */
                    const apiUrl = Form.addField({
                        id: fields.apiUrl,
                        label: 'Url API FAKE Platzi',
                        type: 'text',
                        container: 'custpage_field_group'
                    })
                    
                    /* dejamos un valor por defecto */
                    apiUrl.defaultValue = 'https://api.escuelajs.co/api/v1/';
                    apiUrl.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE })

                    const parameter = Form.addField({
                        id: fields.parameter,
                        label: 'Parametro de Petición',
                        type: 'select',
                        container: 'custpage_field_group'
                    })
                    /* iteramos los parameters creados */
                    parameters.forEach(rs => parameter.addSelectOption({ value: rs.value, text: rs.text, isSelected: rs.isSelected }))
                    parameter.isMandatory = true

                    const typePetition = Form.addField({
                        id: fields.typePetition,
                        label: 'Catalogo de Peticiónes',
                        type: 'select',
                        container: 'custpage_field_group'
                    })
                    typePetition.isMandatory = true
                    /* iteramos los parameters creados */
                    typesPetition.forEach(rs => typePetition.addSelectOption({ value: rs.value, text: rs.text, isSelected: rs.isSelected }))

                    /* Creamos campo el cual se habilitara o deshabilitará por medio el clientScript */
                    const paramsText = Form.addField({
                        id: fields.paramsText,
                        label: 'Parametro de texto',
                        type: 'text',
                        container: 'custpage_field_group'
                    })
                    paramsText.updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED })
                    paramsText.maxLength = 1
                } else {
                    /* 
                    Crea un boton y el client script que tiene una funcion dentro home(),
                    se activa y que es para rdireccionarnos al GET del suitelet
                    */
                    Form.addButton({
                        id: 'custpage_bottom',
                        label: 'Inicio',
                        functionName: 'home()'
                    })
                    /* Cambiamos el titulo */
                    Form.title = 'Peticion exitosa'
                    /* de los parametros del requests, traemos lo que hay en el campo del apiUrl */
                    let urlApi = params[fields.apiUrl];
                    /* Si el param del request, tiene el tipo de peticion datos especificos entra */
                    if (params[fields.typePetition] == 'true') {
                        /* Si estamos buscando por id, entonces concatenamos este numero a la url */
                        urlApi += '/' + params[fields.paramsText]
                        log.debug("url", urlApi)
                    }
                    /* Hacemos la peticion get */
                    const httpsResponse = https.get({ url: urlApi })
                    /* Mandamos una tarea al map */
                    const taskMap = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_s4_sns_mr_test_union',
                        deploymentId: 'customdeploy_s4_sns_mr_test_union',
                        params: {
                            'custscript_s4_sns_parameter': httpsResponse.body
                        }
                    })
                    log.debug('httpsResponse', httpsResponse.body)
                    const taskId = taskMap.submit()
                }
            } catch (e) {
                log.debug('Hubo un error en la ejecución', e)
            } finally {
                response.writePage(Form)
            }
        }

        return handlers
    });