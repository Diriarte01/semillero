/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record'], function (search, record) {
    function execute(context) {
        var customrecord139SearchObj = search.create({
            type: "customrecord_s4_sns_record_cat_f",
            filters:
                [
                ],
            columns:
                [
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Nombre"
                    }),
                    search.createColumn({ name: "scriptid", label: "ID de script" })
                ]
        });
        var searchResultCount = customrecord139SearchObj.runPaged().count;
        log.debug("customrecord_s4_sns_record_cat_fSearchObj result count", searchResultCount);
        customrecord139SearchObj.run().each(function (result) {
            var recordId = result.id;
            record.delete({
                type: 'customrecord_s4_sns_record_cat_f',
                id: recordId
            });
            return true;
        });
    }
    return {
        execute: execute
    };
});