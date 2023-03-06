/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/search', 'N/record', 'N/email'], function (search, record, email) {

    function beforeLoad(context) {

    }

    function beforeSubmit(context) {
        const obj = context.newRecord;
        const client = obj.getValue('entity');
        const categoryC = search.lookupFields({
            type: "customer",
            id: client,
            columns: ["category"]
        })
        const categoryClient = categoryC.category
        const orders = saved_searchs(client);//log.debug('ventas',saved_searchs(client))//Busqueda guardada para saber cuantos pedidos ha realizado el ultimo mes
        log.audit('prueba', orders)

        if (categoryClient.length === 0) {
            discountForOrders(obj, orders) //funcion para validar ordenes

        } else {

            if (categoryClient[0].text === "Premium") {

                obj.setValue({
                    fieldId: "discountitem",
                    value: "340"
                })
                log.audit({
                    title: "premium",
                    details: saved_searchs(client)
                })

            } else {
                discountForOrders(obj, orders) //funcion para validar ordenes
            }
        }

        aproveOrders(obj, client) //funcion para aprobar ordenes
    }

    function afterSubmit(context) {

        try {
            const obj = context.newRecord
            const client = obj.getValue("entity");
            const approval = obj.getValue("approvalstatus");
            const discount = obj.getText("discountitem");
            const totalOrder = obj.getValue("total")


            let check = search.lookupFields({
                type: "customer",
                id: client,
                columns: ["email"]
            })
            check = check.email
            if (check !== "") {
                if (approval == 3) {
                    email.send({
                        author: -5,
                        body: "Su pedido ha sido Rechazado, ya que usted no cuenta con credito, intentelo mas tarde nuevamente o comuniquese con el administratidor",
                        recipients: client,
                        subject: "Su pedido ha sido Rechazado",
                    })
                } else if (approval == 2) {
                    email.send({
                        author: -5,
                        body: `Su pedido se ha procesado correctamente, ademas este Recibio un descunto del  ${discount}%, el valor total del perdido es ${totalOrder}  `,
                        recipients: client,
                        subject: "Su pedido ha sido Aprobado",
                    })
                }
            }
        } catch (error) {
            log.error(error)
        }

    }

    function aproveOrders(obj, client) {
        const totalOrder = obj.getValue("total");
        let limitCredit = search.lookupFields({
            type: 'customer',
            id: client,
            columns: ["creditlimit"]
        })

        let balance = search.lookupFields({
            type: 'customer',
            id: client,
            columns: ["balance"]
        })

        balance = parseFloat(balance.balance)
        let limitCreditParse = limitCredit.creditlimit
        if (limitCreditParse.length === 0) {
            limitCreditParse = 0;
        }

        if (balance == 0 && limitCreditParse > totalOrder) {
            obj.setValue({
                fieldId: "approvalstatus",
                value: 2
            })
        } else if (balance > 0 && (totalOrder + balance) <= limitCreditParse) {
            obj.setValue({
                fieldId: "approvalstatus",
                value: 2
            })
        } else if ((totalOrder + balance) > limitCreditParse) {
            obj.setValue({
                fieldId: "approvalstatus",
                value: 3
            })
        }
    }

    function discountForOrders(obj, orders) {
        if (orders === 0 || orders > 10) {//aqui comprobaremos que el cliente sea un nuevo Cliente y para un cliente con mas de 10 ventas 
            obj.setValue({
                fieldId: "discountitem",
                value: "339"
            })
        } else if (orders > 5 && orders < 10) {//comprobamos que tenga mas de 5 pedidos el ultimo mes -- 5% de descuento
            obj.setValue({
                fieldId: "discountitem",
                value: "338"
            })

        }
    }

    function saved_searchs(client) {

        const filters = [["type", "anyof", "CustInvc"]]
        filters.push("AND", ["name", "anyof", client])
        filters.push("AND", ["trandate", "notbefore", "thirtydaysago"])
        filters.push("AND", ["mainline", "is", "T"])
        const type = "invoice"
        const columns = [search.createColumn({ name: "entity", label: "Nombre" })]
        columns.push(search.createColumn({ name: "trandate", label: "Fecha" }))
        columns.push(search.createColumn({ name: "type", label: "Tipo" }))
        columns.push(search.createColumn({ name: "tranid", label: "Número de documento" }))
        columns.push(search.createColumn({ name: "otherrefnum", label: "PO/Check #" }))
        columns.push(search.createColumn({ name: "amount", label: "Importe" }))
        columns.push(search.createColumn({ name: "amountpaid", label: "Importe pagado" }))
        columns.push(search.createColumn({ name: "amountremaining", label: "Importe restante" }))
        columns.push(search.createColumn({ name: "terms", label: "Términos" }))
        columns.push(search.createColumn({ name: "duedate", label: "Fecha de vencimiento/Fecha límite de recepción" }))
        columns.push(search.createColumn({ name: "daysoverdue", label: "Días vencidos" }))
        const searchData = search.create({
            filters: filters,
            type: type,
            columns: columns
        })

        return searchData.runPaged().count;
    }
    return {
        //beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});