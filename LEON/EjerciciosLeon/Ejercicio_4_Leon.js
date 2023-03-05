/**
 *Ejercicio: 3
 *fecha: 03/03/2023
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author León Basauri
 */
define(['N/search', 'N/record'], function (search, record) {

    function _get(context) {
        log.debug('Initializing search of contacts', context); //Un mensaje de consola para comprobar si entra la función al enviar el GET en Postman
        const response = { code: 400, success: false, data: [], error: [] }
        try {

            const contact = context.id
            const filters = []
            if (contact) {
                filters.push(['internalid', 'anyof', contact]) //Con este filtro podemos traer un solo contacto, en caso de que se requiera, introduciendo su id en los Params del Postman. En caso de no introducir ningún id en el Postman
            }

            let contactSearchObj = search.create({ //Aquí arranca la búsqueda, cuyo script conseguimos al exportarlo de una búsqueda realizada de manera funcional en NetSuite
                type: "contact",
                filters: filters,

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
                        search.createColumn({ name: "subsidiary", label: "Subsidiaria" })
                    ]
            });

            contactSearchObj.run().each(function (result) { //Aquí llamamos a la función contactSearchObj, cuyo argumento result nos servirá más abajo

                //Aquí estructuramos el objeto JSON, que usa getValue para mirar en los registros de contactos y obtener el valor de los campos requeridos
                let obj = new Object();
                obj.id = result.id;
                obj["Nombre"] = result.getValue("entityid");
                obj["Correo Electrónico"] = result.getValue("email");
                obj["Teléfono"] = result.getValue("phone");
                obj["Empresa"] = result.getValue("company");
                obj["Cargo"] = result.getValue("title");
                obj["Subsidiaria"] = result.getValue("subsidiary");


                response.code = 200 //Este código significa OK
                response.success = true
                response.data.push(obj); ////Con el método push mandamos al body del Postman los valores obtenidos de la búsqueda

                return true;
            });

            /*
            contactSearchObj.id="customsearch1677941407466";
            contactSearchObj.title="Búsqueda de Contactos Ej4_León (copy)";
            let newSearchId = contactSearchObj.save();
            */



        }
        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }
        finally {
            return JSON.stringify(response);
        }
    }




    function _post(context) {

        const response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('intizializing creating a contact', context) //Un mensaje de consola para comprobar si entra la función al enviar el POST en Postman
            const data = context.data;

            let newContact = record.create({ //Utilizamos el módulo record con su método .create, que nos permitirá crear un registro
                type: "contact",
                isDynamic: false
            })
            //A continuación rellenamos los campos del registro con los valores que escribirimos en al body del Postman
            newContact.setValue({
                fieldId: "entityid",
                value: data["Nombre"]
            })
            newContact.setValue({
                fieldId: "email",
                value: data["Correo Electrónico"]
            })
            newContact.setValue({
                fieldId: "phone",
                value: data["Teléfono"]
            })
            /* Aquí abajo colocamos un Text en lugar de un Value, 
            dado que el Value del campo empresa es un numerito (su id), 
            y lo que queremos introducir en el Postman es el 
            nombre textual de una empresa */
            newContact.setText({
                fieldId: "company",
                text: data["Empresa"]
            })

            newContact.setValue({
                fieldId: "title",
                value: data["Cargo"]
            })
            newContact.setValue({
                fieldId: "subsidiary",
                value: data["Subsidiaria"]
            })
            /* Llamamos al objeto newContact que almacenó los valores de los campos 
            y guardamos el nuevo contacto con el método .save */
            const saveContact = newContact.save()

            response.data.push({ //Con el método push mandamos lo que quedó guardado en la variable saveContact
                id: saveContact,
                saved: data
            })
            response.code = 201 //Este código significa Created
            response.success = true

        }

        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }

        finally {
            return JSON.stringify(response);
        }


        /* 
        Este es el objeto base que usaremos en el Postman para agregarle valores. 
        Usaremos el mismo para la función PUT
        {
            "data": {
                "Nombre": "",
                "Correo Electrónico": "",
                "Teléfono": "",
                "Empresa": "",
                "Cargo": "",
                "Subsidiaria": ""
            }
        } */




    }

    function _put(context) {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('Initializing editing a contact', context); //Un mensaje de consola para comprobar si entra la función al enviar el PUT en Postman
            const data = context.data
            let editContact = record.load({ //Buscando en la documentación, encontramos el método .load, cuya función es editar un registro
                type: "contact",
                id: data.id,
                isDynamic: false
            })
            /* De manera muy similar a como hicimos con el POST, 
            vamos a estructurar el JSON del Postman para que acceda 
            a los campos de un registro ya existente y los cambie */
            editContact.setValue({
                fieldId: "entityid",
                value: data["Nombre"]
            })
            editContact.setValue({
                fieldId: "email",
                value: data["Correo Electrónico"]
            })
            editContact.setValue({
                fieldId: "phone",
                value: data["Teléfono"]
            })

            editContact.setText({
                fieldId: "company",
                text: data["Empresa"]
            })

            editContact.setValue({
                fieldId: "title",
                value: data["Cargo"]
            })
            editContact.setValue({
                fieldId: "subsidiary",
                value: data["Subsidiaria"]
            })

            /*  Aquí abajo llamamos al objeto editContact que almacenó los valores de los campos 
            y guardamos los cambios realizados al contacto con el método .save */
            const saveContact = editContact.save()

            response.data.push({ //Con el método push mandamos lo que quedó guardado en la variable saveContact
                id: saveContact,
                saved: data
            })
            response.code = 202 //Este código significa Accepted
            response.success = true

        }

        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }

        finally {
            return JSON.stringify(response);
        }
    }

    function _delete(context) {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            log.debug('intizializing deleting a contact', context) //Un mensaje de consola para comprobar si entra la función al enviar el DELETE en Postman
            const data = context.id //Este ID es el que ingresaremos en los "Params" del Postman

            record.delete({ //El método delete simplemente borrará el contacto cuyo ID coincida con el que ingresamos en los Params del Postman
                type: "contact",
                id: data
            });

            response.data.push({
                Deleted: "Contacto eliminado", //Aquí simplemente escribimos un mensaje personalizado
            })

            response.code = 204 //Este código significa "No Content"
            response.success = true
        }

        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }

        finally {
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
