/**
 * Anwar Ruiz
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@Puntuacion 78
 */
define([], function () {
    // A) Cuando el Formulario inicie en modo creación se debe establecer por defecto el cliente

    /**
     * @calificacion  20
     * @retro  Buen Ejercicio, resulto de una manera simple. 
     * @Consejo no usar VAR a menos que sea necesario por necesidades del proyecto en usar version 2 o inferior
     */
    function pageInit(context) {
        var currentRecord = context.currentRecord;
        var mode = context.mode;
        if (mode === 'create' && currentRecord.type === 'salesorder') {
            currentRecord.setValue({
                fieldId: 'entity',
                value: 1691,
            });
        }
    }


    /**
     * 
     * @calificacion  18
     * @retro muy buen ejercicio, pero esta limitando la nueva linea a solo el modo creación
     * @consejo No declarar una variable si no la vas a usar
     */    
    function lineInit(context) {
        // E) Establecer 2 por defecto
        var currentRecord = context.currentRecord;
        var mode = context.mode;
        var sublistId = context.sublistId;
        var line = context.line;
        if (mode === 'create' && sublistId === 'item') {
            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 2,
            });
        } 
        return true;
    }

    /**
     * 
     * @calificacion  20
     * @retro muy buen ejercicio, resultado simple
     * @consejo debes limitar la activacion del Script a una soloa sublista con context. sublist, ya que si existiera mas de una sublista se activaria
     *          si manipularas la otra sublista
     */ 
    function validateLine(context) {
        // C) Validar que la cantidad de un artículo no supere 5 unidades
        var quantity = context.currentRecord.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
        });
        if (quantity > 5) {
            alert('La cantidad no puede ser mayor a 5 unidades.');
            return false; // Impedir el guardado
        }
        return true;
    }

    /**
     * @calificacion  16
     * @retro no cumple totalmente lo que se pide, El mensaje debia ser hecho con un mensaje nativo de NetSuite con modulos como N/iu/dialog o N/iu/message
     */
    function saveRecord(context) {
        // B) Validar que el pedido tenga mínimo 3 líneas 
        var lineCount = context.currentRecord.getLineCount({ sublistId: 'item' });
        if (lineCount < 3) {
            alert('La transacción debe tener como mínimo 3 líneas para guardarse.');
            return false; // Detener el guardado
        }
        return true;
    }

    /**
     * @calificacion  4
     * @retro no cumple totalmente lo que se pide, sigue esforzandote
     */
    function fieldChanged(context) {
        // D) Rellenar el campo Descripción con el articulo
        if (context.fieldId === 'item') {
            var item = context.currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });

        }
    }

    return {
        pageInit: pageInit,
        lineInit: lineInit,
        validateLine: validateLine,
        saveRecord: saveRecord,
        fieldChanged: fieldChanged
    };

});

/* Netsuite References 
https://tstdrv2720065.app.netsuite.com/app/help/helpcenter.nl?fid=section_4387798404.html#bridgehead_4484779426
https://tstdrv2720065.app.netsuite.com/app/help/helpcenter.nl?fid=section_4637584890.html
https://tstdrv2720065.app.netsuite.com/app/help/helpcenter.nl?fid=section_4273153320.html
*/
/*Thirdparty References
https://stackoverflow.com/questions/10729198/what-does-return-false-do
*/