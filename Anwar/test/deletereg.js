/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record'], function (search, record) {
    function execute(context) {
        var customrecord_padreSearchObj = search.create({
            type: "customrecord_padre",
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
        var searchResultCount = customrecord_padreSearchObj.runPaged().count;
        log.debug("customrecord_padreSearchObj result count", searchResultCount);
        customrecord_padreSearchObj.run().each(function (result) {
            var recordId = result.id;
            record.delete({
                type: 'customrecord_padre',
                id: recordId
            });
            return true;
        });
    }
    return {
        execute: execute
    };
});
