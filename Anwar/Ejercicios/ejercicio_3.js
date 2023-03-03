/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@author Anwar Ruiz
 *Fecha 3/2/2023
 */
define(["N/search", "N/record", 'N/email'], function (search, record, email) {

    function beforeSubmit(context) {
        try {
            const obj = context.newRecord;
            const customerId = obj.getValue("entity");
            let invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["name", "anyof", customerId],
                        "AND",
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["trandate", "notbefore", "thirtydaysago"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "ordertype",
                            sort: search.Sort.ASC,
                            label: "Tipo de orden"
                        }),
                        search.createColumn({ name: "mainline", label: "*" }),
                        search.createColumn({ name: "trandate", label: "Fecha" }),
                        search.createColumn({ name: "asofdate", label: "Fecha de corte" }),
                        search.createColumn({ name: "postingperiod", label: "Período" }),
                        search.createColumn({ name: "taxperiod", label: "Período fiscal" }),
                        search.createColumn({ name: "type", label: "Tipo" }),
                        search.createColumn({ name: "tranid", label: "Número de documento" }),
                        search.createColumn({ name: "entity", label: "Nombre" }),
                        search.createColumn({ name: "account", label: "Cuenta" }),
                        search.createColumn({ name: "memo", label: "Nota" }),
                        search.createColumn({ name: "amount", label: "Importe" })
                    ]
            });
            let searchResultCount = invoiceSearchObj.runPaged().count;

            function getDiscount(searchResultCount) {
                let discount;
                if (searchResultCount == 0) {
                    discount = 340;
                }
                else if (searchResultCount >= 5 && searchResultCount < 10) {
                    discount = 341;
                }
                else if (searchResultCount >= 10) {
                    discount = 340;
                }
                return discount;
            }

            let discount = getDiscount(searchResultCount);
            obj.setValue({
                fieldId: "discountitem",
                value: discount
            });

            let category = search.lookupFields({
                type: "customer",
                id: customerId,
                columns: ["category"]
            }).category?.[0]?.text;

            if (category !== "Premium") {
                return; // no se aplica descuento
            }

            obj.setValue({
                fieldId: "discountitem",
                value: 340,
            });

            function getApprovalStatus(customerId, total) {
                let limitCredit = search.lookupFields({
                    type: "customer",
                    id: customerId,
                    columns: ["creditlimit"]
                }).creditlimit;

                let balanceObj = search.lookupFields({
                    type: "customer",
                    id: customerId,
                    columns: ["balance"]
                });

                let total = obj.getValue("total")
                let balance = parseFloat(balanceObj.balance);

                if (balance === 0 && limitCredit > total) {
                    return 2; // aprobado
                } else if (balance > 0 && (total + balance) <= limitCredit) {
                    return 2; // aprobado
                } else if ((total + balance) > limitCredit) {
                    return 3; // rechazado
                }
            }

            let approvalStatus = getApprovalStatus(customerId, obj.getValue("total"));

            obj.setValue({
                fieldId: "approvalstatus",
                value: approvalStatus,
            });

        } catch (error) {
            log.error(error);
        }
    }

    function afterSubmit(context) {
        try {
            const obj = context.newRecord;
            const customerId = obj.getValue("entity");
            const approval = obj.getValue("approvalstatus");
            const discount = obj.getText("discountitem");
            const total = obj.getValue("total")
            let checkEmail = search.lookupFields({
                type: "customer",
                id: customerId,
                columns: ["email"]
            })
            checkEmail = checkEmail.email;

            if (checkEmail !== "") {
                if (approval == 3) {
                    email.send({
                        author: -5,
                        body: "Se ha rechazado el pedido por falta de credito",
                        recipients: customerId,
                        subject: "Ha sido declinada su transaccion",
                    })
                } else if (approval == 2) {
                    email.send({
                        author: -5,
                        body: `Su pedido tiene descuento de ${discount}, el se ha realizado un cobro con la cantidad de ${total} `,
                        recipients: customerId,
                        subject: "Ha sido aprovada su transaccion",
                    })
                }
            }
        } catch (error) {
            log.error(error);
        }
    }

    return {
        //beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
