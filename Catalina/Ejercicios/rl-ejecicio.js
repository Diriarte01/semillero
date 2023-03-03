/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *
 */
define(["N/search", "N/record"], function (search, record) {

    function _get(context) {
        //?Búsqueda
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            let contactSearchObj = search.create({
                type: "contact",
                filters: [],
                columns:
                    [
                        search.createColumn({
                            name: "entityid",
                            sort: search.Sort.ASC,
                            label: "Nombre"
                        }),
                        search.createColumn({ name: "email", label: "Correo electrónico" }),
                        search.createColumn({ name: "phone", label: "Teléfono" }),
                        search.createColumn({ name: "company", label: "Empresa" }),
                        search.createColumn({ name: "title", label: "Puesto de trabajo" }),
                        search.createColumn({ name: "subsidiary", label: "subsidiria" })
                    ]
            });
            let searchResultCount = contactSearchObj.runPaged().count;
            log.debug("contactSearchObj result count", searchResultCount);
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
                response.code = 201;
                response.success = true;
                return true;
            });
        } catch (e) {
            log.error("Hubo un error mapeando", e.message)
            response.code = 500;
            response.success = false;
            response.error.push(e.message);

        } finally {
            return "Has ingresado al API REST de Netsuite" + JSON.stringify(response);
        }
    }

    function _post(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            const data = context.data;
            let recordObj = record.create({
                type: "contact",
                isDynamic: false,
            })
            log.debug("data", data);
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
                fieldId: "subsidiary",
                value: data.subsidiary,
            })

            const saveRecord = recordObj.save();
            response.data.push({ internalId: saveRecord, typeRecord: "contact" })
            response.code = 200;
            response.success = true;
        } catch (e) {
            log.error("Hubo un error al create", e.message)
            response.code = 500;
            response.success = false;
            response.error.push(e.message);
        } finally {
            return response;
        }
    }

    function _put(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {
            const data = context.data;
            let name = data.name
            let contactSearchId = search.create({
                type: "contact",
                filters: [["entityid", "is", name]],
                columns:
                    [
                        search.createColumn({
                            name: "entityid",
                            label: "Nombre"
                        }),
                    ]
            })
            
            contactSearchId.run().each(function (result) {
                let obj = new Object();
                obj.internalId = result.id;

                let recordObj = record.load({
                    type: "contact",
                    id: obj.internalId,
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
                    fieldId: "subsidiary",
                    value: data.subsidiary,
                })
                
                const saveRecord = recordObj.save();
                
                response.data.push({ internalId: saveRecord, typeRecord: "contact" })
                response.code = 200;
                response.success = true;
                return true;
            });
            

        } catch (e) {
            log.error("search result id error", e.message)
            response.code = 500;
            response.success = false;
            response.error = (e.message);
        } finally {
            return "Has ingresado al API REST de Netsuite" + JSON.stringify(response);
        }
    }

    function _delete(context) {
        const response = { code: 400, success: false, data: [], error: [] };
        try {

            log.debug("context", context);
            // const data = context.data;
            // let name = data.name
            // let contactSearchId = search.create({
            //     type: "contact",
            //     filters: [["entityid", "is", name]],
            //     columns:
            //         [
            //             search.createColumn({
            //                 name: "entityid",
            //                 label: "Nombre"
            //             }),
            //         ]
            // })
            // contactSearchId.run().each(function (result) {
            //     let obj = new Object();
            //     obj.internalId = result.id;

            //     let recordObj = record.delete({
            //         type: "contact",
            //         id: obj.internalId,
            //         isDynamic: false,
            //     })
            //     const saveRecord = recordObj.save();
            //     response.data.push({ internalId: saveRecord, typeRecord: "contact" })
            //     response.code = 204;
            //     response.success = true;
            // });
        } catch (error) {
            log.debug("Error deleting contact", error.message);
            response.code = 500;
            response.success = false;
        }finally{
            return response;
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete
    }
});
