/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
 define(['N/ui/serverWidget', 'N/record', "N/https"], function (serverWidget, record, https) {

    function onRequest(context) {

        const response = context.response;
        const request = context.request;
        const params = request.parameters;
        const form = serverWidget.createForm({ title: 'Suitelet - Fake api Platzi' });

        const sublistProductsData = {
            id: 'custpage_s4_sbl_product',
            fields: {
                internalId: 'custpage_s4_sbl_internal_id',
                title: 'custpage_s4_sbl_title',
                price: 'custpage_s4_sbl_price',
                description: 'custpage_s4_sbl_description',
                category: 'custpage_s4_sbl_category',
            }
        }

        const sublistCategoriesData = {
            id: 'custpage_s4_sbl_category',
            fields: {
                internalId: 'custpage_s4_sbl_internal_id',
                title: 'custpage_s4_sbl_title',
            }
        }

        const sublistUsersData = {
            id: 'custpage_s4_sbl_user',
            fields: {
                internalId: 'custpage_s4_sbl_internal_id',
                name: 'custpage_s4_sbl_name',
                role: 'custpage_s4_sbl_role',
                email: 'custpage_s4_sbl_email',
                password: 'custpage_s4_sbl_password',
            }
        }

        const productsUrl = "https://api.escuelajs.co/api/v1/products";
        const categoriesUrl = "https://api.escuelajs.co/api/v1/categories"
        const userUrl = "https://api.escuelajs.co/api/v1/users"

        try {

            if (context.request.method === 'GET') {

                form.addSubmitButton({
                    label: 'Enviar Datos',
                    container: "custpage_s4_get_for_id"
                })

                const apigroup = form.addFieldGroup({
                    id: "custpage_s4_get_for_api",
                    label: "Selecciona la api",
                })



                const method = form.addField({
                    id: "custpage_s4_method",
                    label: "Metodo",
                    type: "SELECT",
                    container: "custpage_s4_get_for_api"
                })
                method.addSelectOption({
                    value: "1",
                    text: "GET"
                })

                method.addSelectOption({
                    value: "2",
                    text: "POST"
                })
                method.isMandatory = true;
                const apiSearch = form.addField({
                    id: "custpage_s4_api",
                    label: "Api",
                    type: "SELECT",
                    container: "custpage_s4_get_for_api"
                })
                apiSearch.isMandatory = true;

                apiSearch.addSelectOption({
                    value: "1",
                    text: "products"
                })

                apiSearch.addSelectOption({
                    value: "2",
                    text: "categories"
                })

                apiSearch.addSelectOption({
                    value: "3",
                    text: "users"
                })

                const selectGroup = form.addFieldGroup({
                    id: "custpage_s4_get_for_id",
                    label: "Selecciona el id que quiereas buscar",
                })

                const searchForId = form.addField({
                    id: "custpage_s4_search_for_id",
                    label: "Buscar por id",
                    type: "text",
                    container: "custpage_s4_get_for_id"
                })

                const productFieldPost = form.addFieldGroup({
                    id: "custpage_s4_create_product",
                    label: "Crear un producto nuevo",
                });

                form.addField({
                    id: "custpage_s4_title",
                    label: "Nombre del Producto",
                    type: "TEXT",
                    container: "custpage_s4_create_product"
                })
                form.addField({
                    id: "custpage_s4_price",
                    label: "Precio del Producto",
                    type: "TEXT",
                    container: "custpage_s4_create_product"

                })
                form.addField({
                    id: "custpage_s4_description",
                    label: "Descripción del Producto",
                    type: "TEXTAREA",
                    container: "custpage_s4_create_product"
                })
                form.addField({
                    id: "custpage_s4_category",
                    label: "Categoria del Producto",
                    type: "TEXT",
                    container: "custpage_s4_create_product"
                })
                form.addField({
                    id: "custpage_s4_image",
                    label: "Imagen del Producto",
                    type: "URL",
                    container: "custpage_s4_create_product"
                })

                const responseProducts = https.get({
                    url: productsUrl,
                    Headers: {
                        name: 'Content-Type',
                        value: 'application/json'
                    }
                });

                const responseCategories = https.get({
                    url: categoriesUrl,
                    Headers: {
                        name: 'Content-Type',
                        value: 'application/json'
                    }
                })

                const responseUsers = https.get({
                    url: userUrl,
                    Headers: {
                        name: 'Content-Type',
                        value: 'application/json'
                    }
                })

                if (responseProducts.code === 200) {
                    createSublistProducts(sublistProductsData, form, JSON.parse(responseProducts.body))
                    createSublistCategory(sublistCategoriesData, form, JSON.parse(responseCategories.body))
                    createSublistUser(sublistUsersData, form, JSON.parse(responseUsers.body))
                } else {



                }

            } else {

                const api = params.custpage_s4_api
                const id = params.custpage_s4_search_for_id
                const method = params.custpage_s4_method
                if (method == 1) {
                    if (api == 1 && id != 0) {
                        const productsUrlId = productsUrl + `/${id}`
                        const responseProducts = https.get({
                            url: productsUrlId,
                            Headers: {
                                name: 'Content-Type',
                                value: 'application/json'
                            }
                        });
                        if (responseProducts.code === 200) {
                            createSublistProducts(sublistProductsData, form, JSON.parse(responseProducts.body))
                        } else {
                            const fieldhtml = form.addField({
                                id: 'custpage_s4_html',
                                label: 'Descripción',
                                type: 'INLINEHTML',
                                container: 'custpage_s4_fiel_group'
                            })
                            const html = `
                                <div>
                                <p style= background-color:red >
                                        El id ${id} no existe: ${responseProducts.code}
                                    </p>
                                </div>
                            `
                            fieldhtml.defaultValue = html

                        }

                    } else if (api == 2 && id != 0) {
                        const categoriesUrlId = categoriesUrl + `/${id}`
                        const responseCategories = https.get({
                            url: categoriesUrlId,
                            Headers: {
                                name: 'Content-Type',
                                value: 'application/json'
                            }
                        })
                        if (responseCategories === 200) {
                            createSublistCategory(sublistCategoriesData, form, JSON.parse(responseCategories.body))
                        } else {
                            const fieldhtml = form.addField({
                                id: 'custpage_s4_html',
                                label: 'Descripción',
                                type: 'INLINEHTML',
                                container: 'custpage_s4_fiel_group'
                            })
                            const html = `
                                <div>
                                <p style= background-color:red >
                                        El id ${id} no existe: ${responseCategories.code}
                                    </p>
                                </div>
                            `
                            fieldhtml.defaultValue = html

                        }
                    } else if ((id != 0)) {
                        const userUrlId = userUrl + `/${id}`
                        const responseUsers = https.get({
                            url: userUrlId,
                            Headers: {
                                name: 'Content-Type',
                                value: 'application/json'
                            }
                        })
                        if (responseUsers === 200) {
                            createSublistUser(sublistUsersData, form, JSON.parse(responseUsers.body))
                        } else {

                            const fieldhtml = form.addField({
                                id: 'custpage_s4_html',
                                label: 'Descripción',
                                type: 'INLINEHTML',
                                container: 'custpage_s4_fiel_group'
                            })
                            const html = `
                                <div>
                                    <p style= background-color:red >
                                        El id ${id} no existe: ${responseUsers.code}
                                    </p>
                                </div>
                            `
                            fieldhtml.defaultValue = html

                        }
                    } else {
                        const fieldhtml = form.addField({
                            id: 'custpage_s4_html',
                            label: 'Descripción',
                            type: 'INLINEHTML',
                            container: 'custpage_s4_fiel_group'
                        })
                        const html = `
                            <div>
                                <p style= background-color:red >
                                    No se Selecciono Ningun ID:
                                </p>
                            </div>
                        `
                        fieldhtml.defaultValue = html
                    }
                } else {

                    //solo creamos Productos sadge 
                    const res = https.post({
                        url: productsUrl,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: params.custpage_s4_title,
                            price: Number(params.custpage_s4_price),
                            description: params.custpage_s4_description,
                            categoryId: Number(params.custpage_s4_category),
                            images: [params.custpage_s4_image]
                        })
                    })
                    log.audit(res.code)
                    if (res.code == 201) {
                        const fieldhtml = form.addField({
                            id: 'custpage_s4_html',
                            label: 'Descripción',
                            type: 'INLINEHTML',
                            container: 'custpage_s4_fiel_group'
                        })
                        const html = `
                                <div>
                                    <p style= background-color:green >
                                        El producto ha sido creado Exitosamente
                                    </p>
                                </div>
                            `
                        fieldhtml.defaultValue = html
                    } else {
                        const fieldhtml = form.addField({
                            id: 'custpage_s4_html',
                            label: 'Descripción',
                            type: 'INLINEHTML',
                            container: 'custpage_s4_fiel_group'
                        })
                        const html = `
                                <div>
                                    <p style= background-color:red >
                                        ha ocurrido un problema en la creacion 
                                    </p>
                                </div>
                            `
                        fieldhtml.defaultValue = html
                    }
                }
            }
        } catch (e) {
            log.error('Hubo un error en la ejecución', e.message)
        } finally {
            response.writePage(form)
        }

    }

    function createSublistCategory(sublistCategoriesData, form, responseBody) {
        const sublistCategory = form.addSublist({
            id: sublistCategoriesData.id,
            label: 'Categorías',
            type: 'list'
        });

        //id Categoria
        sublistCategory.addField({
            id: sublistCategoriesData.fields.internalId,
            label: 'id',
            type: 'text',
            required: true
        })

        //nombre Categoria
        sublistCategory.addField({
            id: sublistCategoriesData.fields.title,
            label: 'Nombre',
            type: 'text',
        })

        responseBody.length == undefined ? responseBody = [responseBody] : responseBody

        for (let i = 0; i < responseBody.length; i++) {
            sublistCategory.setSublistValue({
                id: sublistCategoriesData.fields.internalId,
                line: i,
                value: responseBody[i].id
            })
            sublistCategory.setSublistValue({
                id: sublistCategoriesData.fields.title,
                line: i,
                value: responseBody[i].name
            })

        }

    }

    function createSublistProducts(sublistProductsData, form, responseBody) {
        const sublistProduct = form.addSublist({
            id: sublistProductsData.id,
            label: 'Productos',
            type: 'list'
        });

        //id Producto
        sublistProduct.addField({
            id: sublistProductsData.fields.internalId,
            label: 'id',
            type: 'text',
            required: true
        })

        //nombre Producto
        sublistProduct.addField({
            id: sublistProductsData.fields.title,
            label: 'Nombre',
            type: 'text',
        })

        //precio Producto   
        sublistProduct.addField({
            id: sublistProductsData.fields.price,
            label: 'Precio',
            type: 'text',
        })

        //descripcion Producto
        sublistProduct.addField({
            id: sublistProductsData.fields.description,
            label: 'Descripción',
            type: 'text',
        })

        //categoria Producto
        sublistProduct.addField({
            id: sublistProductsData.fields.category,
            label: 'Categoria',
            type: 'text',
        })
        responseBody.length == undefined ? responseBody = [responseBody] : responseBody
        for (let i = 0; i < responseBody.length; i++) {
            sublistProduct.setSublistValue({
                id: sublistProductsData.fields.internalId,
                line: i,
                value: responseBody[i].id
            })
            sublistProduct.setSublistValue({
                id: sublistProductsData.fields.title,
                line: i,
                value: responseBody[i].title
            })
            sublistProduct.setSublistValue({
                id: sublistProductsData.fields.price,
                line: i,
                value: responseBody[i].price
            })
            sublistProduct.setSublistValue({
                id: sublistProductsData.fields.description,
                line: i,
                value: responseBody[i].description
            })
            sublistProduct.setSublistValue({
                id: sublistProductsData.fields.category,
                line: i,
                value: responseBody[i].category["name"]
            })
        }

        //return sublistProduct
    }

    function createSublistUser(sublistUsersData, form, responseBody) {
        const sublistUser = form.addSublist({
            id: sublistUsersData.id,
            label: 'Usuarios',
            type: 'list'
        })

        //id Usuario
        sublistUser.addField({
            id: sublistUsersData.fields.internalId,
            label: 'id',
            type: 'text',
            required: true
        })

        //nombre Usuario
        sublistUser.addField({
            id: sublistUsersData.fields.name,
            label: 'Nombre',
            type: 'text',
        })

        //rol Usuario
        sublistUser.addField({
            id: sublistUsersData.fields.role,
            label: 'Rol',
            type: 'text',
        })

        //email Usuario
        sublistUser.addField({
            id: sublistUsersData.fields.email,
            label: 'Email',
            type: 'email',
        })

        //password Usuario
        sublistUser.addField({
            id: sublistUsersData.fields.password,
            label: 'Password',
            type: 'text',
        })
        responseBody.length == undefined ? responseBody = [responseBody] : responseBody
        for (let i = 0; i < responseBody.length; i++) {
            sublistUser.setSublistValue({
                id: sublistUsersData.fields.internalId,
                line: i,
                value: responseBody[i].id
            })
            sublistUser.setSublistValue({
                id: sublistUsersData.fields.name,
                line: i,
                value: responseBody[i].name
            })
            sublistUser.setSublistValue({
                id: sublistUsersData.fields.role,
                line: i,
                value: responseBody[i].role
            })
            sublistUser.setSublistValue({
                id: sublistUsersData.fields.email,
                line: i,
                value: responseBody[i].email
            })
            sublistUser.setSublistValue({
                id: sublistUsersData.fields.password,
                line: i,
                value: responseBody[i].password
            })
        }
    }

    return {
        onRequest: onRequest
    }
});
