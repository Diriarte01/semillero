/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@author Catalina Rodriguez
 *Fecha 06/03/2023
 */
define(["N/https", "N/ui/serverWidget", "N/record"], function (https, serverWidget, record) {

    const products = (form, body) => {
        let sublistProducts = form.addSublist({
            id: "custpage_s4_sublist_product",
            label: "Products",
            type: "STATICLIST"
        })
        sublistProducts.addField({
            id: "custpage_s4_product_id",
            label: "#",
            type: "INTEGER",
        })
        sublistProducts.addField({
            id: "custpage_s4_product_title",
            label: "Titulo del Producto",
            type: "TEXT",
        })
        sublistProducts.addField({
            id: "custpage_s4_product_price",
            label: "Precio del Producto",
            type: "INTEGER",
        })
        sublistProducts.addField({
            id: "custpage_s4_product_description",
            label: "Descripción del Producto",
            type: "TEXT",
        })
        sublistProducts.addField({
            id: "custpage_s4_product_category",
            label: "Categoria del Producto",
            type: "TEXT",
        })
        sublistProducts.addField({
            id: "custpage_s4_product_image",
            label: "Imagen del Producto",
            type: "URL",
        })

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
    }
    const productsPost = (form) => {
        form.addFieldGroup({
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
    }
    const categories = (form, body) => {
        let sublistCategories = form.addSublist({
            id: "custpage_s4_sublist_category",
            label: "Categories",
            type: "STATICLIST"
        })
        sublistCategories.addField({
            id: "custpage_s4_category_id",
            label: "#",
            type: "INTEGER",
        })
        sublistCategories.addField({
            id: "custpage_s4_category_name",
            label: "Nombre de la Categoria",
            type: "TEXT",
        })
        sublistCategories.addField({
            id: "custpage_s4_category_image",
            label: "Imagen de la Categoria",
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
    }
    const users = (form, body) => {
        let sublistUsers = form.addSublist({
            id: "custpage_s4_sublist_users",
            label: "Users",
            type: "STATICLIST"
        })
        sublistUsers.addField({
            id: "custpage_s4_users_id",
            label: "#",
            type: "INTEGER",
        })
        sublistUsers.addField({
            id: "custpage_s4_users_email",
            label: "Email del Usuario",
            type: "TEXT",
        })

        sublistUsers.addField({
            id: "custpage_s4_users_name",
            label: "Nombre de Usuario",
            type: "TEXT",
        })
        sublistUsers.addField({
            id: "custpage_s4_users_role",
            label: "Rol del Usuario",
            type: "TEXT",
        })
        sublistUsers.addField({
            id: "custpage_s4_users_avatar",
            label: "Avatar del Usuario",
            type: "URL",
        })
        for (let k = 0; k < body.length; k++) {
            sublistUsers.setSublistValue({
                id: "custpage_s4_users_id",
                line: k,
                value: body[k].id
            })
            sublistUsers.setSublistValue({
                id: "custpage_s4_users_email",
                line: k,
                value: body[k].email
            })
            sublistUsers.setSublistValue({
                id: "custpage_s4_users_name",
                line: k,
                value: body[k].name
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
    }
    const errors = (form, id) => {
        const fieldhtml = form.addField({
            label: 'Error',
            id: 'custpage_s4_html',
            type: 'INLINEHTML',
            container: 'custpage_s4_fiel_group'
        })
        let html = `
            <div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500&display=swap');
                p {
                    color:red; 
                    font-size:20px; 
                    font-family: 'Mukta', sans-serif;
                    font-weight: bold;
                }
            </style>
            <p >
                    El id ${id} no existe
                </p>
            </div>
        `
        fieldhtml.defaultValue = html
    }
    const createFields = (form) => {
        /* Creamos  un grupo de campos al formulario y su boton de envio */
        form.addSubmitButton({
            label: "Consumir"
        })
        /* usamos addButton para crearle funcionalidad al boton para cada seccion */
        form.addFieldGroup({
            id: "custpage_s4_select",
            label: "Datos de seleccion",
        })

        let methods = form.addField({
            id: "custpage_s4_method",
            label: "Metodo",
            type: "SELECT",
            container: "custpage_s4_select"
        })
        methods.isMandatory = true;

        methods.addSelectOption({
            value: "1",
            text: "GET"
        })
        methods.addSelectOption({
            value: "2",
            text: "POST"
        })

        let section = form.addField({
            id: "custpage_s4_section",
            label: "Seccion",
            type: "SELECT",
            container: "custpage_s4_select"
        })
        section.isMandatory = true;
        section.addSelectOption({
            value: "1",
            text: "products"
        })
        section.addSelectOption({
            value: "2",
            text: "categories"
        })
        section.addSelectOption({
            value: "3",
            text: "users"
        })
        form.addField({
            id: "custpage_s4_search_for_id",
            label: "Buscar por id",
            type: "text",
            container: "custpage_s4_select"
        })
    }
    const onRequest = (context) => {

        /* Tomamos la respuesta del contexto */
        const response = context.response;
        /* Tomamos los requisitos del contexto */
        const request = context.request;
        /* De este request tomamos los parametros */
        const params = request.parameters;
        /* Creamos un Formulario con el serverWidget */
        const form = serverWidget.createForm({
            title: "Suitelet - Ejercicio 5",
        })
        let url = "https://api.escuelajs.co/api/v1"
        try {
            if (request.method === "GET") {
                form.title = form.title + " metodo GET";
                /* sublist */
                createFields(form);
                productsPost(form);
            } else {
                form.title = form.title + " renderizado"
                let method = params.inpt_custpage_s4_method;
                let section = params.inpt_custpage_s4_section;
                let id = params.custpage_s4_search_for_id;
                if (params.custpage_s4_section == 1) {
                    id ? url = url + `/${section}/${id}` : url = url + `/${section}`
                }
                else if (params.custpage_s4_section == 2) {
                    id ? url = url + `/${section}/${id}` : url = url + `/${section}`
                }
                else if (params.custpage_s4_section == 3) {
                    id ? url = url + `/${section}/${id}` : url = url + `/${section}`
                }

                if (method === "GET") {
                    let res = https.get({
                        url: url,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    let body = JSON.parse(res.body);
                    body.length == undefined ? body = [body] : body
                    switch (section) {
                        case "products":
                            res.code == 200 ? products(form, body) : errors(form, id)

                            break;
                        case "categories":
                            res.code == 200 ? categories(form, body) : errors(form, id)
                            break;
                        case "users":
                            res.code == 200 ? users(form, body) : errors(form, id)
                            break;
                    }
                }
                else {
                    let res2 = https.post({
                        url: url,
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
                    /* Proceso de render */
                    res2 = JSON.parse(res2.body)
                    log.debug("res", res2.category)
                    const fieldhtml = form.addField({
                        label: 'Show',
                        id: 'custpage_s4_html',
                        type: 'INLINEHTML',
                        container: 'custpage_s4_fiel_group'
                    })
                    let html = `
                        <div>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500&display=swap');
                            p, h1 {
                                color:green;
                                font-size:20px;
                                font-family: 'Mukta', sans-serif;
                                font-weight: bold;
                            }
                        </style>
                        <h1>Se ha Creado el Producto</h1>
                        <p>ID: ${res2.id} </p>
                            <p>NOMBRE: ${res2.title}</p>
                            <p>PRECIO: ${res2.price}</p>
                            <p>DESCRICION: ${res2.description}</p>
                            <p>CATEGORIA: ${res2.category["name"]}</p>
                            <p>IMAGEN: <a href="${res2.images}" target="_blank">Ver Imagen</a></p>
                        </div>
                    `
                    fieldhtml.defaultValue = html
                    
                }
            }
        } catch (error) {
            log.error("error", error.message)
        } finally {
            response.writePage(form)
        }
    }

    return {
        onRequest: onRequest
    }
});

/* 
Documentacion
https://fakeapi.platzi.com/en/rest/introduction
Page
https://fakeapi.platzi.com/
Tipos de campos
https://tstdrv2719149.app.netsuite.com/app/help/helpcenter.nl?fid=section_4332671056.html
 */