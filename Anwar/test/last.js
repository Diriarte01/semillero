/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'],
    function (search, record) {

        function _get(context) {
            log.debug('Initializing search of customer', context);
            const response = { code: 400, success: false, data: [], error: [] }
            try {
                const type = 'customer';
                const filters = [];
                const customer = context.entity

                if (customer) {
                    filters.push(["internalid", "anyof", customer])
                }
                const columns = [search.createColumn({ name: "entityid", })];
                columns.push(search.createColumn({ name: "isperson", label: "Es individual" }));
                columns.push(search.createColumn({ name: "companyname", label: "Nombre de la empresa" }));
                columns.push(search.createColumn({ name: "email", label: "Correo electrónico" }));
                columns.push(search.createColumn({ name: "phone", label: "Teléfono" }))
                let searchcustomer = search.create({ type: type, filters: filters, columns: columns });

                searchcustomer.run().each(function (result) {
                    let obj = new Object();
                    obj.internalId = result.id;
                    let isperson = result.getValue('isperson') == 'T' ? true : false;
                    if (isperson) {
                        obj.name = result.getValue('entityid');
                    } else {
                        obj.name = result.getValue('companyname');
                    }
                    obj.email = result.getValue('email');
                    obj.phone = result.getValue('phone');
                    response.data.push(obj);
                    return true;
                });

                response.code = 200
                response.success = true;
            } catch (e) {
                log.error('Error creating', e.message);
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