/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/email'], 
    
    function(search, email) {

        function execute(context) {
            const filters = [["type","anyof","CustInvc"]];
            filters.push("AND", ["mainline","is","T"])
            //filters.push("AND",["datecreated","after","31/12/2022"])
            const type = "invoice";
            const columns = [ search.createColumn({
                name: "entityid",
                join: "customer",
                summary: "GROUP",
                label: "Nombre"
            })];
            columns.push(   search.createColumn({
                name: "internalid",
                join: "customer",
                summary: "COUNT",
                label: "ID interno"
            }))

            columns.push( search.createColumn({
                name: "amount",
                summary: "SUM",
                label: "Importe"
            }))
            
            const searchData = search.create({ type: type, filters:filters ,columns:columns });
            var searchResultCount = searchData.runPaged().count;
            log.debug("invoiceSearchObj result count",searchResultCount);
            const summary = new Object();

            searchData.run().each(function(rs){
                let internalId = rs.getValue({
                    name: "entityid",
                    join: "customer",
                    summary: "GROUP"
                })
               
                let quantityInvoice = rs.getValue({
                    name: "internalid",
                    join: "customer",
                    summary: "COUNT"
                })
                let quantityAmount = rs.getValue({
                    name: "amount",
                    summary: "SUM",
                    label: "Importe"
                })

                email.send({
                    author: -5,
                    body: `hola muchas gracias por haber realizado ${ quantityInvoice} compras por un valor toal de ${ quantityAmount}`,
                    recipients: internalId,
                    subject: 'Transacciones',
                })
                return true
            })
            log.audit('summary', summary)
        }

        return {
            execute: execute
        }
    }
);
