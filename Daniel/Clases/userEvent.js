/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/https', 'N/file','N/email'], 
    function(https, file, email) {

        /*Antes de la carga */
        function beforeLoad(context) {
            log.debug('beforeLoad',new Date())
            let obj = context.newRecord;
            let form = context.form;

            let category = form.addField({
                id: 'custpage_s4_categories',
                label: 'Categorias Custom',
                type: 'select',
                source: '922',
            })
        }

        /* Antes del envio al serividor*/
        function beforeSubmit(context) {
            log.debug('beforeSubmit',new Date())
            let request = https.get({ url: 'https://api.escuelajs.co/api/v1/products'});
            log.debug('request', request.body);
            let jsResponse = file.create({
                name: 'respuesta_platzi.JSON',
                fileType: file.Type.JSON,
                contents: request.body,
                folder: -15
            })
            jsResponse.save()
        }

        /* despues del envio del servidor */
        function afterSubmit(context) {
            log.debug('afterSubmit',new Date())
            email.send({
                author: -5,
                body: 'Se ha creado un cliente y tu seras su representante',
                recipients:-5,
                subject: 'Se te ha asigando un nuevo Cliente',
            })
        }

        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        }
    }
);
