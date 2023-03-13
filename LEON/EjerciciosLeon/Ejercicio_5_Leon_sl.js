/**
 *Ejercicio: 5
 *fecha: 07/03/2023
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@author León Basauri
 */
define(['N/ui/serverWidget', "N/https"], function (serverWidget, https) {

    function onRequest(context) {
        const response = context.response;
        const request = context.request;
        const params = request.parameters;
        const form = serverWidget.createForm({ title: 'Ejercicio 5 Suitelet' });
        let url = "https://api.escuelajs.co/api/v1"
        try {
            if (request.method === 'GET') {
                form.title += ' Método GET'

                /* Con este botón de abajo podremos 
                acceder al método POST y mostrar 
                la info de la API */
                form.addSubmitButton({
                    label: 'Consumir API de Patzi'
                })

                /* Aquí creamos el contenedor
                de nuestro futuro campo */
                const filterGroup = form.addFieldGroup({
                    id: 'custpage_s4_filtergroup',
                    label: 'Filtro',
                })


                /* Aquí creamos un campo de tipo 
                select(lista desplegable) */
                const selectField = form.addField({
                    id: "custpage_s4_selectfield",
                    label: "Tipo de dato",
                    type: "SELECT",
                    container: "custpage_s4_filtergroup"
                })

                /* Aquí creamos las opciones de
                la lista desplegable */
                selectField.addSelectOption({
                    value: "1",
                    text: "Productos"
                })
                selectField.addSelectOption({
                    value: "2",
                    text: "Categorías"
                })
                selectField.addSelectOption({
                    value: "3",
                    text: "Usuarios"
                })
                log.debug('dame el context', context)
                log.debug('dame el request', request)
                log.debug('dame los params', params)


            }

            else {
                form.title += " Método POST"

                /* Estos logs me sirvieron para entender
                qué hay dentro */
                log.debug('dame el context2', context)
                log.debug('dame el request2', request)
                log.debug('dame los params2', params)


                /* Aquí cambiamos la url de acuerdo a la
                opción seleccionada en la interfaz GET */
                if (selectField.value == 1) {
                    url = url + '/products'

                } else if (selectField.value == 2) {
                    url = url + '/categories'

                } else if (selectField.value == 3) {
                    url = url + '/users'

                }

                /* Con el método get del módulo https, 
                consumios la url en cuestión */
                const rest = https.get({
                    url: url,
                    headers: {
                        "Content-Type": "application/json"
                    }

                })

                /* Convertimos el JSON body de la url en algo
                que podamos leer como un objeto, lo que nos servirá
                para rellenar los campos que veremos más adelante */
                let body = JSON.parse(rest.body);

                log.debug('rest body después del parse', rest.body)

                /*Creamos un objeto para tomar el valor o el
                texto de la opción seleccionada anteriormente en 
                la interfaz GET */
                const selectField = {
                    value: params.custpage_s4_selectfield,
                    text: params.inpt_custpage_s4_selectfield
                }

                /* Con un switch case, mostraremos en la interfaz POST una
                sublista diferente, dependiendo de lo que hayamos
                seleccionado en la interfaz GET */
                switch (selectField.text) {
                    case "Productos":
                        /* Creamos la sublista con sus respectivos campos */
                        const sublistProducts = form.addSublist({
                            id: "custpage_s4_sublist_products",
                            label: "Productos",
                            type: "STATICLIST"
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_id",
                            label: "#",
                            type: "INTEGER",
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_title",
                            label: "Nombre",
                            type: "TEXT",
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_price",
                            label: "Precio",
                            type: "INTEGER",
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_description",
                            label: "Descripción",
                            type: "TEXTAREA",
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_category",
                            label: "Categoria",
                            type: "TEXT",
                        })
                        sublistProducts.addField({
                            id: "custpage_s4_product_image",
                            label: "Imagen",
                            type: "URL",
                        })

                        /* Rellenamos la sublista con los valores del objeto
                        body que consumimos de la API */
                        for (let i = 0; i < body.length; i++) {
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_id",
                                line: i,
                                value: body[i].id
                            })
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_title",
                                line: i,
                                value: body[i].title
                            })
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_price",
                                line: i,
                                value: body[i].price
                            })
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_description",
                                line: i,
                                value: body[i].description
                            })
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_category",
                                line: i,
                                value: body[i].category.name
                            })
                            sublistProducts.setSublistValue({
                                id: "custpage_s4_product_image",
                                line: i,
                                value: body[i].images[0]
                            })

                        }
                        break;




                    case "Categorías":
                        const sublistCategories = form.addSublist({
                            id: "custpage_s4_sublist_categories",
                            label: "Categorías",
                            type: "STATICLIST"
                        })
                        sublistCategories.addField({
                            id: "custpage_s4_category_id",
                            label: "#",
                            type: "INTEGER",
                        })
                        sublistCategories.addField({
                            id: "custpage_s4_category_name",
                            label: "Nombre",
                            type: "TEXT",
                        })
                        sublistCategories.addField({
                            id: "custpage_s4_category_image",
                            label: "Imagen",
                            type: "URL",
                        })

                        for (let j = 0; j < body.length; j++) {
                            sublistCategories.setSublistValue({
                                id: "custpage_s4_category_id",
                                line: j,
                                value: body[j].id
                            })

                            sublistCategories.setSublistValue({
                                id: "custpage_s4_category_name",
                                line: j,
                                value: body[j].name
                            })
                            sublistCategories.setSublistValue({
                                id: "custpage_s4_category_image",
                                line: j,
                                value: body[j].image
                            })
                        }
                        break;

                    case "Usuarios":
                        const sublistUsers = form.addSublist({
                            id: "custpage_s4_sublist_users",
                            label: "Usuarios",
                            type: "STATICLIST"
                        })
                        sublistUsers.addField({
                            id: "custpage_s4_users_id",
                            label: "#",
                            type: "INTEGER",
                        })

                        sublistUsers.addField({
                            id: "custpage_s4_users_name",
                            label: "Nombre",
                            type: "TEXT",
                        })

                        sublistUsers.addField({
                            id: "custpage_s4_users_email",
                            label: "Email",
                            type: "TEXT",
                        })

                        sublistUsers.addField({
                            id: "custpage_s4_users_role",
                            label: "Rol",
                            type: "TEXT",
                        })
                        sublistUsers.addField({
                            id: "custpage_s4_users_avatar",
                            label: "Avatar",
                            type: "URL",
                        })

                        for (let k = 0; k < body.length; k++) {
                            sublistUsers.setSublistValue({
                                id: "custpage_s4_users_id",
                                line: k,
                                value: body[k].id
                            })

                            sublistUsers.setSublistValue({
                                id: "custpage_s4_users_name",
                                line: k,
                                value: body[k].name
                            })

                            sublistUsers.setSublistValue({
                                id: "custpage_s4_users_email",
                                line: k,
                                value: body[k].email
                            })

                            sublistUsers.setSublistValue({
                                id: "custpage_s4_users_role",
                                line: k,
                                value: body[k].role
                            })
                            sublistUsers.setSublistValue({
                                id: "custpage_s4_users_avatar",
                                line: k,
                                value: body[k].avatar
                            })
                        }
                        break;
                }
            }

        }

        catch (e) {
            log.error('Hubo un error en la ejecución', e.message)
        }
        finally {
            response.writePage(form)
        }
    }

    return {
        onRequest: onRequest
    }
});
