/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@author Catalina R
 */
define(['N/runtime', 'N/record'],
    function (runtime, record) {

        const handlers = {};
        handlers.getInputData = () => {
            try {
                const runtimeScript = runtime.getCurrentScript();
                // *Representa al script que se esta ejecutando actualmente
                // !.getParameter = nos muestra el parametro creado desde nuestro despliegue en la subficha parametros
                //! este parametro nos pasa, lo que le mandamos en el task como params, este lo trae en string
                let params = JSON.parse(runtimeScript.getParameter({ name: 'custscript_s4_sns_parameter' }))
                // * Creamos el registro
                const obj = record.create({ type: 'customrecord_s4_import_fake_api' })
                // * Seteamos valores 
                obj.setValue('name', 'importación ' + new Date())
                let resultOne = {}
                const saveObj = obj.save();
                if (Array.isArray(params)) {
                    params.map(rs => rs.recordId = saveObj)
                } else {
                    params.recordId = saveObj
                }
                log.debug("params", params);
                if (params.length == undefined) {
                    resultOne.one = params
                    return resultOne
                }
                return params
            } catch (e) {
                log.error('error en el get', e.message)
            }
        }

        handlers.map = (context) => {
            try {
                const obj = JSON.parse(context.value)
                log.debug('Context sin parse', obj.recordId);
                // Aqui ingresamos objeto por objeto y enlazamos el parent en cada busqueda 
                const objRecord = record.create({ type: 'customrecord_s4_data_import_fake_api' })
                    .setValue('custrecord136', obj)
                    .setValue('custrecord137', obj.recordId)
                objRecord.save();
            } catch (e) {
                log.error('error en el map', e.message)
            }
        }

        return handlers;
    }
);