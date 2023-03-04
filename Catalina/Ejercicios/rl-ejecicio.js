/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Catalina R
 *Fecha 03/03/2023
 */
define(["N/search", "N/record"], function (search, record) {

    function _get(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            const type = "contact";
            const filters = [];
            const contact = context.id;

            /* Busqueda de un solo contacto por id, sino busqueda a todas */
            if (contact) {
                filters.push(["internalid", "anyof", contact])
            }

            const columns = [search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "Nombre" })];
            columns.push(search.createColumn({ name: "email", label: "Correo electrónico" }));
            columns.push(search.createColumn({ name: "phone", label: "Teléfono" }));
            columns.push(search.createColumn({ name: "company", label: "Empresa" }));
            columns.push(search.createColumn({ name: "title", label: "Puesto de trabajo" }));
            columns.push(search.createColumn({ name: "subsidiary", label: "subsidiria" }));

            let contactSearchObj = search.create({
                type: type, filters: filters, columns: columns,
            });
            contactSearchObj.run().each(function (result) {
                let obj = new Object();
                obj.internalId = result.id;
                obj.name = result.getValue("entityid");
                obj.email = result.getValue("email");
                obj.phone = result.getValue("phone");
                obj.company = result.getValue("company");
                obj.title = result.getValue("title");
                obj.subsidiary = result.getValue("subsidiary");
                response.data.push(obj);
                response.code = 200;
                response.success = true;
                return true;
            });
        } catch (e) {
            log.error("Hubo un error mapeando", e.message)
            response.code = 500;
            response.success = false;
            response.error.push(e.message);

        } finally {
            return JSON.stringify(response);
        }
    }


    /* Creamos con subsidiaria y nombre del contacto por ser campos obligatorios*/
    function _post(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            const data = context.data;
            let recordObj = record.create({
                type: "contact",
                isDynamic: false,
            })

            recordObj.setValue({
                fieldId: "entityid",
                value: data.name,
            })
            recordObj.setValue({
                fieldId: "email",
                value: data.email,
            })
            recordObj.setValue({
                fieldId: "phone",
                value: data.phone,
            })
            recordObj.setValue({
                fieldId: "company",
                value: data.company,
            })

            recordObj.setValue({
                fieldId: "title",
                value: data.title,
            })
            recordObj.setValue({
                fieldId: "subsidiary",
                value: data.subsidiary,
            })

            const saveRecord = recordObj.save();
            response.data.push({ internalId: saveRecord, saved: data, typeRecord: "contact" })
            response.code = 201;
            response.success = true;
        } catch (e) {
            log.error("Hubo un error al create", e.message)
            response.code = 500;
            response.success = false;
            response.error.push(e.message);
        } finally {
            return JSON.stringify(response);
        }
    }


    /* Buscamos por el id para cambiar datos o tambien por el nombre sin colocar id */
    function _put(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            const data = context.data;
            const contactId = data.internalId
            const name = data.name;
            const type = "contact";
            const filters = [];
            const columns = [];
            if (contactId) {
                filters.push(["internalid", "is", contactId])
                log.debug("entra en ID", "entra en ID")
            } else if (name) {
                filters.push(["entityid", "is", name])
                columns.push(search.createColumn({ name: "entityid", label: "Nombre" }))
                log.debug("entra en Nombre", "entra en Nombre")
            }
            let contactSearch = search.create({
                type: type,
                filters: filters,
                columns: columns
            })
            contactSearch.run().each(function (result) {
                let obj = new Object();
                obj.internalId = result.id;
                let recordObj = record.load({
                    type: "contact",
                    id: obj.internalId,
                    isDynamic: false,
                })
                recordObj.setValue({
                    fieldId: "company",
                    value: data.company,
                })
                recordObj.setValue({
                    fieldId: "entityid",
                    value: data.name,
                })
                recordObj.setValue({
                    fieldId: "email",
                    value: data.email,
                })
                recordObj.setValue({
                    fieldId: "phone",
                    value: data.phone,
                })

                recordObj.setValue({
                    fieldId: "title",
                    value: data.title,
                })
                recordObj.setValue({
                    fieldId: "subsidiary",
                    value: data.subsidiary,
                })

                const saveRecord = recordObj.save();
                // log.debug("data saved", data)
                response.data.push({ internalId: saveRecord, changed: data, typeRecord: "contact" })
                response.code = 200;
                response.success = true;
                return true;
            });
        } catch (e) {
            log.error("search name error", e.message)
            response.code = 500;
            response.success = false;
            response.error = (e.message + " O los campos obligatorios subsidiaria y nombre deberian tener un valor");
        } finally {
            return JSON.stringify(response);
        }
    }
    /* Escribimos en los params de postman con el id &id=2001 este numbero será el contacto a eliminar
    y en el body dejamos unos brackets vacios  */
    function _delete(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            log.debug("context, con")
            let contactId = context.id;

            record.delete({
                type: "contact",
                id: contactId
            });
            response.data.push({ status: "El contacto ha sido eliminado exitosamente", typeRecord: "contact" })
            response.code = 204;
            response.success = true;
        } catch (error) {
            log.debug("Error deleting contact", error.message);
            response.code = 500;
            response.success = false;
            response.error = (error.message)
        } finally {
            return JSON.stringify(response);
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete
    }
});
