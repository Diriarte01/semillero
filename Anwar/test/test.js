/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@author Catalina R
 *Fecha 3/2/2023
 */
define(["N/search", "N/record", 'N/email'], function (search, record, email) {

    function beforeSubmit(context) {
        try {
            const obj = context.newRecord;
            const client = obj.getValue("entity");
            let invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["trandate", "notbefore", "thirtydaysago"],
                        "AND",
                        ["name", "anyof", client]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "trandate",
                            sort: search.Sort.DESC,
                            label: "Fecha"
                        }),
                        search.createColumn({ name: "type", label: "Tipo" }),
                        search.createColumn({ name: "tranid", label: "Número de documento" }),
                        search.createColumn({ name: "otherrefnum", label: "PO/Check #" }),
                        search.createColumn({ name: "entity", label: "Nombre" }),
                        search.createColumn({ name: "amount", label: "Importe" }),
                        search.createColumn({ name: "fxamount", label: "Importe (moneda extranjera)" }),
                        search.createColumn({ name: "currency", label: "Moneda" }),
                        search.createColumn({ name: "statusref", label: "Estado" }),
                        search.createColumn({ name: "daysopen", label: "Días pendientes" })
                    ]
            });
            let searchResultCount = invoiceSearchObj.runPaged().count;

            if (searchResultCount == 0 || searchResultCount >= 10) {
                obj.setValue({
                    fieldId: "discountitem",
                    value: 339,
                })

                if (searchResultCount == 0) {
                    obj.setValue({
                        fieldId: "messagesel",
                        value: 6,
                    })
                }
            } else if (searchResultCount >= 5) {
                let discount = obj.setValue({
                    fieldId: "discountitem",
                    value: 338,
                })
                log.debug("message 5 count", discount);
            }

            let categoryObj = search.lookupFields({
                type: "customer",
                id: client,
                columns: ["category"]
            })
            let category = categoryObj.category

            if (category.length !== 0) {
                if (category[0].text === "Premium") {
                    obj.setValue({
                        fieldId: "discountitem",
                        value: 340,
                    })
                }
            }

            /*
            invoiceSearchObj.id="customsearch1677792838345";
            invoiceSearchObj.title="test search ue cat (copy)";
            let newSearchId = invoiceSearchObj.save();

             * Punto A 
             */
            let limitCredit = search.lookupFields({
                type: "customer",
                id: client,
                columns: ["creditlimit"]
            })
            limitCredit = limitCredit.creditlimit;
            let balanceObj = search.lookupFields({
                type: "customer",
                id: client,
                columns: ["balance"]
            })
            let total = obj.getValue("total")
            let balance = parseFloat(balanceObj.balance);

            if (balance == 0 && limitCredit > total) { // caso exito 
                obj.setValue({
                    fieldId: "approvalstatus",
                    value: 2,
                })
            } else if (balance > 0 && (total + balance) <= limitCredit) {// caso exito 
                obj.setValue({
                    fieldId: "approvalstatus",
                    value: 2,
                })

            } else if ((total + balance) > limitCredit) { // fracaso total
                obj.setValue({
                    fieldId: "approvalstatus",
                    value: 3,
                })
            }
        } catch (error) {
            log.error(error);
        }

    }

    function afterSubmit(context) {
        try {
            const obj = context.newRecord
            const client = obj.getValue("entity");
            const approval = obj.getValue("approvalstatus");
            const discount = obj.getText("discountitem");
            const total = obj.getValue("total")
            let checkEmail = search.lookupFields({
                type: "customer",
                id: client,
                columns: ["email"]
            })
            checkEmail = checkEmail.email;

            if (checkEmail !== "") {

                if (approval == 3) {
                    email.send({
                        author: -5,
                        body: "Se ha rechazado el pedido, por falta de credito, intentelo más tarde o comuniquese con el administrador",
                        recipients: client,
                        subject: "Ha sido declinada su transaccion",
                    })
                } else if (approval == 2) {
                    email.send({
                        author: -5,
                        body: `Gracias por contar siempre con nosotros, tu pedido quedo con un descuento de ${discount}, tu pedido quedo en un valor de ${total} `,
                        recipients: client,
                        subject: "Ha sido aprovada su transaccion",
                    })
                }
            }
        } catch (error) {
            log.error(error);
        }
    }
    return {
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
