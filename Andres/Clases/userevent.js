/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define([], function() {

    function beforeLoad(context) {
        let obj = context.newRecord;
        let form = context.form;

        let category = form.addField({
            id: 'custpage_s4_categories',//los campos personalizados y sublitas deben iniciar por cutspage o tirara error
            label: 'categories_custom',
            type: 'select',
            source: '127',
        })
    }

    function beforeSubmit(context) {
        
    }

    function afterSubmit(context) {
        
    }

    return {
        beforeLoad: beforeLoad,
        //beforeSubmit: beforeSubmit,
        //afterSubmit: afterSubmit
    }
});
