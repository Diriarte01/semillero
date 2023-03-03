/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'],
    function (search, record) {

        function _get(context) {
            log.debug('Initializing search of contacts', context);
            const response = { code: 400, success: true, data: [], error: [] }
            try {
                let contactId = context.contact;
                log.debug("contactId", contactId)
                let contactData = [];
                var filter = [];

                filter.push(["isinactive", "is", "F"]);

                if (contactId != "all") {
                    filter.push("AND", ["internalid", "anyof", contactId])
                }

                var contactSearchObj = search.create({
                    type: "contact",
                    filters:
                        [
                            filter
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "ID interno" }),
                            search.createColumn({ name: "entityid", label: "Nombre" }),
                            search.createColumn({ name: "email", label: "Correo electrónico" }),
                            search.createColumn({ name: "phone", label: "Teléfono" }),
                            search.createColumn({ name: "company", label: "Empresa" }),
                            search.createColumn({ name: "title", label: "Puesto de trabajo" })
                        ]
                });
                var searchResultCount = contactSearchObj.runPaged().count;
                log.debug("contactSearchObj result count", searchResultCount);
                contactSearchObj.run().each(function (result) {
                    contactData.push({
                        internalId: result.getValue("internalid"),
                        entityName: result.getValue("entityid"),
                        email: result.getValue("email"),
                        phone: result.getValue("phone"),
                        company: result.getValue("company"),
                        rol: result.getValue("title")
                    })

                    return contactData;
                });

                log.debug("contactData", contactData)
                response.isSuccessful = true;
                response.data = contactData
                response.message = 'La transaccion fue exitosa';
                response.code = 'S4-200';
                log.audit("response", response)
                return JSON.stringify(response);

            } catch (e) {
                log.error({
                    title: "¡Ya nos exhibiste!",
                    details: e
                })
            } finally {
                return JSON.stringify(response)
            }
        }

        function _post(context) {
            log.debug('Initializing creation of a new contact', context);
            const response = { code: 400, success: false, data: [], error: [] }
            try {

            } catch (error) {
                log.error('Error creating', e.message);
                response.code = 500
                response.error = e.message
                response.success = false
            } finally {
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