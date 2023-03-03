/*
Ejercicios de SuiteScript: UserEvent

1- Para la práctica presente se requiere implementar un Script de tipo UserEvent en el formulario de Factura de Venta y el cual se debe seleccionar el entrypoints adecuado para hacer las siguientes ejecuciones:

Nota: Para esta actividad se requiere crear una categoría de cliente llamada "Premiun" que debe ser aplicado en varios registros de clientes, también se requiere crear un artículo de descuento que va ser aplicado según como lo pida el ejercicio y activar proceso de aprobación para factura de venta.

Verificar que el cliente tiene crédito disponible suficiente para realizar el pedido.

A)  Si el cliente tiene crédito disponible suficiente, entonces actualizar el saldo del cliente y marcar el pedido como aprobado.

B)  Si el cliente no tiene crédito disponible suficiente, entonces rechaza el pedido y envía un correo electrónico al cliente informando la situación.

C)  Si el cliente es un cliente nuevo (no ha realizado ningún pedido anteriormente), entonces crear automáticamente una factura de bienvenida con un descuento del 10% del valor total del pedido.

D)  Si el cliente ha realizado más de 5 pedidos en el último mes, entonces otorgarle un descuento del 5% del valor total del pedido.

E)  Si el cliente ha realizado más de 10 pedidos en el último mes, entonces otorgarle un descuento del 10% del valor total del pedido.

F)  Si el cliente tiene una categoría de cliente "premium", entonces otorgarle un descuento del 15% del valor total del pedido.

G)  Enviar un correo electrónico al cliente informando del descuento aplicado en su pedido.

Fecha de Entrega:

Semillero NetSuite: 02 de Marzo/ 7:00 pm

Api Center: 05 de Marzo/ 7:00 pm
*/


/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/email'], function (record, email) {

    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        var customerId = newRecord.getValue({ fieldId: 'entity' });
        var customer = record.load({ type: record.Type.CUSTOMER, id: customerId });
        var availableCredit = customer.getValue({ fieldId: 'creditlimit' }) - customer.getValue({ fieldId: 'balance' });
        var total = newRecord.getValue({ fieldId: 'total' });

        if (total <= availableCredit) {
            // Si el cliente tiene crédito suficiente, actualizar saldo y marcar pedido como aprobado
            customer.setValue({ fieldId: 'balance', value: customer.getValue({ fieldId: 'balance' }) + total });
            customer.save();
            newRecord.setValue({ fieldId: 'custbody_pedido_aprobado', value: true });
        } else {
            // Si el cliente no tiene crédito suficiente, rechazar pedido y enviar correo electrónico
            newRecord.setValue({ fieldId: 'custbody_pedido_rechazado', value: true });
            email.send({
                author: -5, // ID del usuario que envía el correo electrónico
                recipients: customerId,
                subject: 'Pedido rechazado',
                body: 'Lo sentimos, su pedido ha sido rechazado debido a la falta de crédito disponible en su cuenta.'
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };

});


/*
https://tstdrv2720065.app.netsuite.com/app/help/helpcenter.nl?fid=section_4358681681.html
*/