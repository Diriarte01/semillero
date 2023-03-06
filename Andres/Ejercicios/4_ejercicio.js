/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
 define(['N/search', 'N/record'], function (search, record) {

    function _get(context) {

        const response = {
            code: 400, success: false,
            data: [],
            errors: []
        }

        try {

            const type = 'contact';
            const filters = [];
            const columns = [search.createColumn({
                name: "internalid",
                sort: search.Sort.ASC,
                label: "ID interno"
            })]
            columns.push(search.createColumn({
                name: "entityid",
                label: "Nombre"
            }));
            columns.push(search.createColumn({
                name: "email",
                label: "Correo electrónico"
            }));
            columns.push(search.createColumn({
                name: "phone",
                label: "Teléfono"
            }));
            columns.push(search.createColumn({
                name: "company",
                label: "Empresa"
            }));
            columns.push(search.createColumn({
                name: "title",
                label: "Puesto de trabajo"
            }));
            const contactSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns,
            });
            contactSearchObj.run().each(function (result) {
                let obj = new Object();
                obj.internalId = result.id;
                obj.name = result.getValue('entityid')
                obj.email = result.getValue('email')
                obj.phone = result.getValue('phone')
                obj.company = result.getValue('company')
                obj.title = result.getValue('title')
                response.data.push(obj)
                return true;
            });
            response.code = 200
            response.success = true;
        } catch (e) {
            response.code = 500
            response.errors = e.message
            response.success = false
        } finally {
            return JSON.stringify(response)
        }
    }

    function _post(context) {
        log.debug('Creando Contacto', context)
        const response = {
            code: 400, 
            success: false,
            data: [],
            errors: []
        }
        try {
            const data = context.data;
            let recordObj = record.create({
                type: 'contact',
                isDinamyc: false,
            })
            recordObj.setValue({
                fieldId: 'entityid',
                value: data.name
                })
            recordObj.setValue({
                fieldId: 'email',
                value: data.email   
            })
            recordObj.setValue({
                fieldId: 'phone',
                value: data.phone
            })
            recordObj.setValue({
                fieldId: 'company',
                value: data.company
            })
            recordObj.setValue({
                fieldId: 'title',
                value: data.title
            })
            recordObj.setValue({
                fieldId: 'subsidiary',
                value: data.subsidiary
            })
            const saveRecord = recordObj.save()
            response.data.push({
                internalId: saveRecord,
                typeRecord: 'contact'
            })
            response.code = 200
            response.success = true;
        } catch (e) {
            log.error("no se puede crear el contacto", e.message)
            response.code = 500
            response.errors = e.message
            response.success = false
            response.errors.push(e.message);
        } finally {
            return response
        }


    }

    function _put(context) {


        const response = {
            code: 400, success: false,
            data: [],
            errors: []
        }
        const responseBusqueda = {
            code: 400, success: false,
            data: [],
            errors: []  
        }

        try {

            const data = context.data;
            const type = 'contact';
            const filters = [["entityid","is",data.name]];
            const columns = [search.createColumn({
                name: "internalid",
                sort: search.Sort.ASC,
                label: "ID interno"
            })]
            columns.push(search.createColumn({
                name: "entityid",
                label: "Nombre"
            }));
            columns.push(search.createColumn({
                name: "email",
                label: "Correo electrónico"
            }));
            columns.push(search.createColumn({
                name: "phone",
                label: "Teléfono"
            }));
            columns.push(search.createColumn({
                name: "company",
                label: "Empresa"
            }));
            columns.push(search.createColumn({
                name: "title",
                label: "Puesto de trabajo"
            }));
            const contactSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns,
            });
            contactSearchObj.run().each(function (result) {
                let obj = new Object();
                obj.internalId = result.id;
                obj.name = result.getValue('entityid')
                obj.email = result.getValue('email')
                obj.phone = result.getValue('phone')
                obj.company = result.getValue('company')
                obj.title = result.getValue('title')
                responseBusqueda.data.push(obj)
                return true;
            });
            const obj = responseBusqueda.data
            let recordObj = record.load({
                type: 'contact',
                id: obj[0].internalId,

            })

            recordObj.setValue({
                fieldId: 'entityid',
                value: data.name
                })
            recordObj.setValue({
                fieldId: 'email',
                value: data.email   
            })
            recordObj.setValue({
                fieldId: 'phone',
                value: data.phone
            })
            recordObj.setValue({
                fieldId: 'company',
                value: data.company
            })
            recordObj.setValue({
                fieldId: 'title',
                value: data.title
            })

            recordObj.save();
            response.data.push(data)
            response.code = 200
            response.success = true;
           
        } catch (e) {   
            log.error("no se puede editar el contacto", e.message)
            response.code = 500
            response.errors = e.message
            response.success = false
            response.errors.push(e.message);
        }finally{
            return JSON.stringify(response)
        }

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