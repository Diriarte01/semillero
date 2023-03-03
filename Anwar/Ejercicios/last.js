/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/search'], function (search) {

    function beforeLoad(context) {
        var invoiceSearchObj = search.create({
            type: "invoice",
            filters:
                [
                    ["name", "anyof", "1691"],
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
        var searchResultCount = invoiceSearchObj.runPaged().count;
        log.debug("invoiceSearchObj result count", searchResultCount);
        invoiceSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            return true;
        });

        /*
        invoiceSearchObj.id="customsearch1677815188440";
        invoiceSearchObj.title="Custom Búsqueda de Transacción (copy)";
        var newSearchId = invoiceSearchObj.save();
        */
    }

    function beforeSubmit(context) {

    }

    function afterSubmit(context) {

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
