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
            // {
            //     internalId: "61",
            //     analysisOrd: "Prueba de Orde de analisis",
            //     date: "2023-04-27",
            //     requestor: "SERVIMETERS",
            //     email: "servimeters@servimeters.com",
            //     sender: "Prueba de Servicio",
            //     city: "964",
            //     laboratory: "13827",
            //     executionAudit: "7",
            //     processNum: "05234",
            //     nSample: "2",
            //     descriptionFeature: "es una prueba",
            //     sample: "617",
            //     rule: "icontec",
            //     item: "",
            //     product: "11"
            //  }
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

