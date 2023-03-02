/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'], 
    function(search, record) {

        function _get(context) {
            log.debug('Initializing search of provider', context);
            const response = { code: 400, success: false, data:[] , error:[] }
            try{
                const type = 'vendor';
                const filters = [];
                const provider = context.provider
                
                if(provider){
                    filters.push(["internalid","anyof", provider])
                }

                const columns = [search.createColumn({ name: "entityid", })];
                columns.push(search.createColumn({name: "isperson", label: "Es individual"}));
                columns.push(search.createColumn({name: "companyname", label: "Nombre de la empresa"}));
                columns.push(search.createColumn({name: "email", label: "Correo electrónico"}));
                columns.push(search.createColumn({name: "phone", label: "Teléfono"}))
                let searchProvider = search.create({ type: type, filters:filters, columns:columns });
                
                searchProvider.run().each(function(result){
                    let obj = new Object();
                    obj.internalId = result.id;
                    let isperson = result.getValue('isperson') == 'T'? true: false;
                    if(isperson){
                        obj.name = result.getValue('entityid');
                    }else{
                        obj.name = result.getValue('companyname');
                    }
                    obj.email = result.getValue('email');
                    obj.phone = result.getValue('phone');
                    response.data.push(obj);
                    return true;
                });
                response.code = 200
                response.success = true;
            }catch(e){
                log.error('un error en el codigo', e);
                response.code = 500
                response.error = e.message
                response.success = false
            }finally{
                return JSON.stringify(response)
            }
        }

        function _post(context) {
            log.debug('Initializing created of purchase Order', context);
            const response = { code: 400, success: false, data:[] , error:[] }
            try{
                const data = context.data;
                let recordObj = record.create({ type: 'purchaseorder',  isDynamic: false })
                recordObj.setValue('entity', data.provider);
                for (const i in data.line ) {
                    let obj = data.line[i];
                    recordObj.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i,
                        value: obj.itemId
                    })
                    recordObj.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i,
                        value: obj.quantity
                    })
                } 
                const saveRecord = recordObj.save();
                response.data.push({internalId: saveRecord, typeTransaction : 'purchasarse order'});
                response.code = 200
                response.success = true;
            }catch(e){
                log.error('Error creating', e.message);
                response.code = 500
                response.error = e.message
                response.success = false
            }finally{
                return response
            }
        }

        function _put(context) {
            
        }

        function _delete(context) {
            
        }

        return {
            get: _get,
            post: _post,
            put: _put,
            delete: _delete
        }
    }
);
