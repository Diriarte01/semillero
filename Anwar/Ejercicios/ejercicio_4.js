/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'], function (search, record) {

    function _get(context) {
        log.debug('Initializing search of contacts', context);
        let response = { code: 400, success: true, data: [], error: [] }
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
            response.success = true;
            response.data = contactData
            response.code = '201';
            log.audit("response", response)
            return JSON.stringify(response);

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
        let response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('Initializing creation of a new contact', context);
            const data = context.data;

            let contact = record.create({
                type: "contact",
                isDynamic: false,
            })

            contact.setValue({
                fieldId: 'entityid',
                value: data.entityName,
            })

            contact.setValue({
                fieldId: 'email',
                value: data.email,
            })

            contact.setValue({
                fieldId: 'phone',
                value: data.phone,
            })

            for (let i = 0; i < data.length; i++) {
                contact.setSublistValue({
                    sublistId: "company",
                    fieldId: 'company',
                    line: i,
                    value: data.company,
                })
            }

            contact.setValue({
                fieldId: 'title',
                value: data.title,
            })

            contact.setValue({
                fieldId: 'subsidiary',
                value: data.subsidiary,
            })
            log.debug('is data ok?', data);

            const saveContact = contact.save();
            response.data.push({
                id: saveContact,
                saved: data
            }

            )
            log.debug("Se creó el contacto", data);
            response.success = true;
            response.code = '201';


        } catch (e) {
            log.error('Error creatingg', e.message);
            response.code = 500
            response.error.push(e.message);
            response.success = false
        } finally {
            return response
        }
    }

    function _put(context) {
        let response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('Initializing update of a contact', context);
            const data = context.data;

            let contact = record.load({
                type: "contact",
                id: data.internalId,
                isDynamic: false,
            })

            contact.setValue({
                fieldId: 'entityid',
                value: data.entityName,
            })

            contact.setValue({
                fieldId: 'email',
                value: data.email,
            })

            contact.setValue({
                fieldId: 'phone',
                value: data.phone,
            })

            for (let i = 0; i < data.length; i++) {
                contact.setSublistValue({
                    sublistId: "company",
                    fieldId: 'company',
                    line: i,
                    value: data.company,
                })
            }

            contact.setValue({
                fieldId: 'title',
                value: data.title,
            })

            contact.setValue({
                fieldId: 'subsidiary',
                value: data.subsidiary,
            })

            const saveContact = contact.save();
            response.data.push({
                id: saveContact,
                saved: data
            }

            )
            log.debug("Se creó el contacto", data);
            response.success = true;
            response.code = '201';
        } catch (e) {
            log.error('Error creatingg', e.message);
            response.code = 500
            response.error = e.message
            response.success = false
        } finally {
            return response
        }
    }

    function _delete(context) {
        let response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('Initializing disposal of a contact', context);
            const data = context.id;

            record.delete({
                type: "contact",
                id: data
            });

            response.data.push({
                Deleted: "contacto eliminado",
            })

            response.success = true;
            response.code = '201';
        } catch (e) {
            log.error('Error deleting', e.message);
            response.code = 500
            response.error.push(e.message);
            response.success = false
        } finally {
            return response
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete
    }
}
);