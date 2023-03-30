/**
* @NApiVersion 2.x
* @NScriptType Restlet
* @NModuleScope SameAccount
*/

define(['N/search', 'N/record'], function (search, record) {

    function post(createData) {

        var invoiceFolio = createData.custrecord_s4_sns_folio_invoice;

        // Get the custom record with the given invoice folio
        var filters = [
            ["custrecord_s4_sns_folio_invoice", "is", invoiceFolio]
        ];
        var searchResults = record.search({
            type: 'customrecord_s4_sns_folio',
            filters: filters
        });


        var record = searchResults.run().getRange({ start: 0, end: 1 })[0];

        // Create a new custom record for Conauto
        var conautoRecord = record.create({
            type: 'customrecord_s4_sns_conauto'
        });
        conautoRecord.setValue("custrecord_s4_sns_ca_folio", record.id);

        // Create a new custom record for details
        var detailRecord = record.create({
            type: 'customrecord_s4_sns_detail'
        });
        detailRecord.setValue("custrecord_s4_sns_da_month", createData.month);
        detailRecord.setValue("custrecord_s4_sns_da_quantity", createData.quantity);

        // Save the records
        var conautoId = conautoRecord.save();
        var detailId = detailRecord.save();

        // Return a response object
        var response = {
            message: "Conauto and detail records created successfully",
            data: {
                conautoId: conautoId,
                detailId: detailId
            }
        };

        return response;
    }

    return {
        post: post
    };
});








