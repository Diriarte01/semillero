/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
define(['N/record', 'N/search', 'N/email', 'N/runtime'],
    function (record, search, email, runtime) {

        function getInputData() {
            const response = [];
            const type = 'invoice', filters = [["type", "anyof", "CustInvc"]], columns =[search.createColumn({ name: "amount", label: "Importe" })]
            filters.push("AND", ["mainline", "is", "T"], "AND", ["amount", "greaterthanorequalto", "1000.00"]);
            filters.push("AND", ["datecreated", "within", "01/02/2023 12:00 am", "06/03/2023 11:59 pm"]);
            columns.push(search.createColumn({name: "entity", label: "Nombre"}))
            var invoiceSearchObj = search.create({ type: "invoice", filters:filters, columns:columns });
            
            invoiceSearchObj.run().each(function (rs) {
                const obj = new Object();
                obj.internalId = rs.id;
                obj.idCustomer = rs.getValue('entity');
                obj.nameCustomer = rs.getText('entity');
                obj.amount = Number(rs.getValue('amount'))
                response.push(obj);
                return true;
            });
            return response;
        }

        function map(context) {
            log.debug('Entrando al Map', context);
            try{
                const value = JSON.parse(context.value)
                const recordObj = record.load({ type: 'invoice', id: value.internalId, isDynamic: true });
                
                recordObj.selectNewLine({ sublistId: 'item'})
                recordObj.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: 3675})
                recordObj.commitLine({ sublistId: 'item' })
                recordObj.save();
                context.write({
                    key: value.idCustomer,
                    value: { discount: value.amount * 0.1, nameCustomer: value.nameCustomer }
                });
            }catch(e){
                log.error('Erro en el map', e.message)
            }
                
        }

        function reduce(context) {
            log.debug('Entrando al reduce', context);
            const user = runtime.getCurrentUser();
            const discount = context.values.reduce((a,b)=> a + JSON.parse(b).discount,0);
            try{
                email.send({
                    author: user.id,
                    body: `
                            Gracias por ser un cliente fiel, de las ${context.values.length} te hemos obsequido un descuento total de ${discount}
                    `,
                    recipients: context.key,
                    subject: 'Descuento aplicado',
                })
            }catch(e){
                log.error('Erro en el reduce', e.message)
            }

        }

        function summarize(summary) {
            log.debug('Entrando al summary', summary);
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        }
    }
);
