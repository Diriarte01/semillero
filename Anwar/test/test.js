/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'],
    function (search, record) {

        function _get(context) {
            log.debug('Initializing search of provider', context);
            const response = { code: 400, success: false, data: [], error: [] }
            try {
                
            } catch (e) {
                log.error('un error en el codigo', e);
                response.code = 500
                response.error = e.message
                response.success = false
            } finally {
                return JSON.stringify(response)
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
    }
);