/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(['N/runtime', 'N/record'], 
    function(runtime, record) {

        const handlers = {};
        handlers.getInputData= () =>{
            try{
                const runtimeScript = runtime.getCurrentScript();
                let params = JSON.parse(runtimeScript.getParameter({name: 'custscript_api'}));
                const obj = record.create({ type: 'customrecord_s4_import_fake_api' })
                obj.setValue('name', 'importación ' + new Date())
                const saveObj = obj.save();
                if(Array.isArray(params)){
                    params.map(rs => rs.recordId = saveObj )
                }else{
                    params.recordId = saveObj
                }
                return params
            }catch(e){
                log.debug('error en el get', e)
            }
        }

        handlers.map = (context) =>{
            try{
                const obj = JSON.parse(context.value);
                log.debug('Context', obj);
                const objRecord = record.create({ type: 'customrecord_s4_data_import_fake_api' })
                .setValue('custrecord136', obj)
                .setValue('custrecord137', obj.recordId)
                objRecord.save();
            }catch(e){
                log.debug('error en el map', e)
            }
        }
  
        return handlers;
    }
);
