/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search'], function(search) {
    //currentRecord.getLineCount('item');
    function _get(context) {
        log.debug('inicializing search of provider', context)
        const response = {code: 400, success: false,
            data:[],
            errors:[]
          }
        try {
           
        } catch (error) {
            response.code = 500
            response.error = e.message
            response.success = false
        }finally{
           return response
        }
    }

    function _post(context) {
        
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
});
