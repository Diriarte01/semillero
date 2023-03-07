/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/https', 'N/file'],
    function (serverWidget, record, https, file) {

        function onRequest(context) {
            const form = serverWidget.createForm({ title: 'testSuitelet' });
            form.addSubmitButton({ label: 'Enviar Datos' });
            const response = context.response;
            const request = context.request;
            const params = request.parameters;
            try {
                // Crear el formulario

                const filterField = form.addField({
                    id: 'custpage_filter_field',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Filtrar por:',
                    mandatory: true
                });

                filterField.addSelectOption({
                    value: 'producto',
                    text: 'Producto'
                });

                filterField.addSelectOption({
                    value: 'categoria',
                    text: 'Categoria'
                });

                filterField.addSelectOption({
                    value: 'usuario',
                    text: 'Usuario',
                });



                // Declarar las APIs que se van a utilizar
                var headers = {
                    'Content-Type': 'application/json'
                };

                var urlproducts = 'https://api.escuelajs.co/api/v1/products';
                var urlcategories = 'https://api.escuelajs.co/api/v1/categories';
                var urlusers = 'https://api.escuelajs.co/api/v1/users';

                if (request.method === 'GET') {

                }
                else {
                    const respp = https.get({
                        url: urlproducts,
                        headers: headers
                    });

                    const respc = https.get({
                        url: urlcategories,
                        headers: headers
                    });

                    const respu = https.get({
                        url: urlusers,
                        headers: headers
                    });
                    if (respu.code !== 200) {
                        log.error('Error al consumir la API');
                        return;
                    }
                    let bodyp = JSON.parse(respp.body);
                    let bodyc = JSON.parse(respc.body);
                    let bodyu = JSON.parse(respu.body);

                    form.title = form.title + ' - Respuesta';

                    log.debug('filtro', bodyc);

                    switch (params.custpage_filter_field) {
                        case 'producto':
                            const sublistProducts = form.addSublist({
                                id: 'sublist_products',
                                label: 'Productos',
                                type: serverWidget.SublistType.LIST
                            });

                            sublistProducts.addField({
                                id: 'custpage_internalid',
                                label: 'ID',
                                type: serverWidget.FieldType.INTEGER
                            });

                            sublistProducts.addField({
                                id: 'custpage_name',
                                label: 'Nombre',
                                type: serverWidget.FieldType.TEXT
                            });

                            sublistProducts.addField({
                                id: 'custpage_description',
                                label: 'Descripción',
                                type: serverWidget.FieldType.TEXTAREA
                            });

                            sublistProducts.addField({
                                id: 'custpage_price',
                                label: 'Precio',
                                type: serverWidget.FieldType.INTEGER
                            });

                            for (let i = 0; i < bodyp.length; i++) {
                                log.debug('sublist', params.custpage_filter_field == 'producto');
                                sublistProducts.setSublistValue({
                                    id: 'custpage_name',
                                    line: i,
                                    value: bodyp[i].title
                                });
                                log.debug('title', params.custpage_filter_field == 'producto');
                                sublistProducts.setSublistValue({
                                    id: 'custpage_description',
                                    line: i,
                                    value: bodyp[i].description
                                });
                                log.debug('des', params.custpage_filter_field == 'producto');
                                sublistProducts.setSublistValue({
                                    id: 'custpage_internalid',
                                    line: i,
                                    value: bodyp[i].id
                                });
                                log.debug('id', params.custpage_filter_field == 'producto');
                                sublistProducts.setSublistValue({
                                    id: 'custpage_price',
                                    line: i,
                                    value: bodyp[i].price
                                });
                                log.debug('price', params.custpage_filter_field == 'producto');
                            }
                            break;
                        case 'categoria':
                            const sublistCategories = form.addSublist({
                                id: 'sublist_categories',
                                label: 'Categorias',
                                type: serverWidget.SublistType.LIST
                            });

                            sublistCategories.addField({
                                id: 'custpage_internalid',
                                label: 'ID',
                                type: serverWidget.FieldType.INTEGER
                            });

                            sublistCategories.addField({
                                id: 'custpage_name',
                                label: 'Nombre',
                                type: serverWidget.FieldType.TEXT
                            });

                            for (let i = 0; i < bodyc.length; i++) {
                                sublistCategories.setSublistValue({
                                    id: 'custpage_name',
                                    line: i,
                                    value: bodyc[i].name
                                });

                                sublistCategories.setSublistValue({
                                    id: 'custpage_internalid',
                                    line: i,
                                    value: bodyc[i].id
                                });
                            }
                            break;
                        case 'usuario':
                            const sublistUsers = form.addSublist({
                                id: 'sublist_users',
                                label: 'Usuarios',
                                type: serverWidget.SublistType.LIST
                            });

                            sublistUsers.addField({
                                id: 'custpage_internalid',
                                label: 'ID',
                                type: serverWidget.FieldType.INTEGER
                            });

                            sublistUsers.addField({
                                id: 'custpage_name',
                                label: 'Nombre',
                                type: serverWidget.FieldType.TEXT
                            });

                            sublistUsers.addField({
                                id: 'custpage_email',
                                label: 'Email',
                                type: serverWidget.FieldType.TEXT
                            });

                            for (let i = 0; i < bodyu.length; i++) {
                                sublistUsers.setSublistValue({
                                    id: 'custpage_name',
                                    line: i,
                                    value: bodyu[i].name
                                });

                                sublistUsers.setSublistValue({
                                    id: 'custpage_email',
                                    line: i,
                                    value: bodyu[i].email
                                });

                                sublistUsers.setSublistValue({
                                    id: 'custpage_internalid',
                                    line: i,
                                    value: bodyu[i].id
                                });
                            }
                            break;
                    }

                }
            }
            catch (e) {
                log.error('Error', e.message)
            }
            finally {
                response.writePage(form)
            }
        }
        return {
            onRequest: onRequest
        }
    }
);