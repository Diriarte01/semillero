/**
 *Ejercicio: 3
 *fecha: 03/03/2023
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@author León Basauri
 */


define(['N/search', 'N/email'], function (search, email) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {

        try {
            log.audit('entra', 'entra')
            const obj = context.newRecord;
            const customerId = obj.getValue('entity');
            let invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["voided", "is", "F"],
                        "AND",
                        ["trandate", "notbefore", "lastmonthtodate"], //Fecha: El ultimo mes
                        "AND",
                        ["mainline", "is", "T"], //Linea principal: true
                        "AND",
                        ["type", "anyof", "CustInvc"], //Tipo de transacción: Factura de venta
                        "AND",
                        ["entity", "anyof", customerId] //ID del cliente
                    ],
                columns:
                    [
                        search.createColumn({ name: "trandate", sort: search.Sort.DESC, label: "Fecha" }),
                        search.createColumn({ name: "type", label: "Tipo" }),
                        search.createColumn({ name: "tranid", label: "Número de documento" }),
                        search.createColumn({ name: "entity", label: "Nombre" }),
                        search.createColumn({ name: "amount", label: "Importe" }),
                        search.createColumn({ name: "fxamount", label: "Importe (moneda extranjera)" }),
                        search.createColumn({ name: "statusref", label: "Estado" }),
                        search.createColumn({ name: "daysopen", label: "Días pendientes" })
                    ]
            });
            let searchResultCount = invoiceSearchObj.runPaged().count;
            log.debug("invoiceSearchObj result count", searchResultCount);

            searchResultCount //variable contador de facturas

            //inciso D 
            if (searchResultCount == 0 || searchResultCount > 10) {
                obj.setValue({
                    fieldId: 'discountitem',
                    value: '339'
                })
            }
            //Inciso C y E
            else if (searchResultCount > 5) {
                obj.setValue({
                    fieldId: 'discountitem',
                    value: '338'
                })
            }
            //Inciso F
            let idPremium = search.lookupFields({
                type: 'customer',
                id: customerId,
                columns: ['category']
            })
            log.debug('categoría del cliente', idPremium);

            textPremium = idPremium.category
            if (textPremium.length !== 0 && textPremium[0].text === "Premium") {
                obj.setValue({
                    fieldId: 'discountitem',
                    value: 340
                })
            }



            invoiceSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                return true;
            });

            /*
            invoiceSearchObj.id="customsearch1677790290306";
            invoiceSearchObj.title="Facturas del ultimo mes por Cliente (copy)";
            var newSearchId = invoiceSearchObj.save();
            */
        }
        catch (e) {
            log.error('Se ha generado un error', e)
        }



        //Inciso A
        try {
            const obj = context.newRecord;
            const customerId = obj.getValue("entity")
            let creditLimit = search.lookupFields({
                type: 'customer',
                id: customerId,
                columns: 'creditlimit'
            })

            creditLimit = creditLimit.creditlimit;
            const balanceObj = search.lookupFields({
                type: "customer",
                id: customerId,
                columns: "balance"
            })
            log.debug('límite de cred del cliente', creditLimit);

            let total = obj.getValue("total")
            let balanceAmount = parseFloat(balanceObj.balance)

            if ((balanceAmount == 0 && creditLimit > total) || (balanceAmount > 0 && (total + balanceAmount) <= creditLimit))
                if (balanceAmount == 0 && creditLimit > total) {
                    obj.setValue({
                        fieldId: "approvalstatus",
                        value: 2,
                    })
                }
                else if ((total + balanceAmount) > creditLimit) {
                    obj.setValue({
                        fieldId: "approvalstatus",
                        value: 3,
                    })
                }
        }

        catch (e) {
            log.error('Se ha generado un error', e)
        }


    }

    function afterSubmit(context) {
        try {
            const obj = context.newRecord
            const customerId = obj.getValue("entity");
            const approved = obj.getValue("approvalstatus");
            const discount = obj.getText("discountitem");
            const total = obj.getValue("total")
            // const userObj = runtime.getCurrentUser();
            // let idEmployee = userObj.id;
            let verifyEmail = search.lookupFields({
                type: "customer",
                id: customerId,
                columns: ["email"]
            })
            verifyEmail = verifyEmail.email;

            if (verifyEmail !== "") {

                //Inciso B
                if (approved == 3) {
                    email.send({
                        author: -5,
                        body: "El pedido ha sido rechazado por falta de crédito",
                        recipients: customerId,
                        subject: "Transacción rechazada",
                    })
                }
                //Inciso G
                else if (approved == 2 && discount != "") {
                    email.send({
                        author: -5,
                        body: `¡Gracias por tu compra! Te informamos que se te ha aplicado un descuento de ${discount}. El costo final de tu pedido quedó en ${total} `,
                        recipients: customerId,
                        subject: "Transacción completada con éxito",
                    })
                }
                else if (approved == 2) {
                    email.send({
                        author: -5,
                        body: `¡Gracias por tu compra! Estás cada vez más cerca de obtener un descuento.`,
                        recipients: customerId,
                        subject: "Transacción completada con éxito",
                    })
                }

            }
        } catch (e) {
            log.error(('Se ha generado un error', e));
        }






    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
