/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(["N/search", "N/email"], function (search, email) {

    function execute(context) {
        try {

            log.debug("context", context);
            const type = "invoice";
            const filters = []
            const columns = []
            filters.push(["type", "anyof", "CustInvc"])
            filters.push("AND", ["trandate", "within", "previousoneyear"])
            filters.push("AND", ["mainline", "is", "T"])
            columns.push(search.createColumn({ name: "entityid", join: "customer", summary: "GROUP", label: "Nombre" }))
            columns.push(search.createColumn({ name: "amount", summary: "SUM", label: "Importe" }))
            columns.push(search.createColumn({ name: "internalid", join: "customerMain", summary: "GROUP", label: "ID interno" }))
            columns.push(search.createColumn({ name: "email", join: "customer", summary: "GROUP", label: "Correo electrónico" }))
            const invoiceSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns
            });
            const searchResultCount = invoiceSearchObj.runPaged().count;
            log.audit("invoiceSearchObj result count", searchResultCount);
            invoiceSearchObj.run().each((result) => {
                let id = result.getValue({
                    name: "internalid", 
                    join: "customerMain", 
                    summary: "GROUP", 
                })
                let sendEmail = result.getValue({
                    name: "email",
                    join: "customer",
                    summary: "GROUP",
                })
                let quantityInvoice = result.getValue({
                    name: "internalid",
                    join: "customer",
                    summary: "COUNT",
                })
                let amount = result.getValue({
                    name: "amount",
                    summary: "SUM",
                    label: "Importe"
                })
                if (sendEmail != "- None -") {
                    email.send({
                        author: -5,
                        body: `Gracias por haber realizado ${quantityInvoice} cantidad de compras por un total de ${amount}`,
                        recipients: id,
                        subject: "Transacciones",
                    })
                } else {
                    log.debug("sin correo", id)
                }
                return true;
            });
        } catch (error) {
            log.error("error", error.message)
        }
    }
    return {
        execute: execute
    }
});

