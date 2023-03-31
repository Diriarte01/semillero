/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */

define(["N/record", "N/search", 'N/format'], function (record, search, format) {
    const responseData = {};
    responseData.code = 200;
    responseData.message = "Registro exitoso";
    responseData.data = {};

    function post(createData) {
        const data = createData.data;
        const typeTransaction = createData.type;
        switch (typeTransaction) {
            case "Tabla":
                createFolio(data, responseData);
                createTable(data, responseData);
                break;
            case "TablaPI":
                createFolio(data, responseData);
                createTable(data, responseData);
                createDetail(data, responseData);
                updateFields(data, responseData);
                break;
            case "Detalle":
                createDetail(data, responseData);
                updateFields(data, responseData);
                break;
        }
        return responseData;
    }


    function createFolio(data, responseData) {
        try {
            const errorMessage = validateFolioData(data);
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            let date = new Date();
            let formattedDate = format.format({ value: date, type: format.Type.DATE });
            const newRecord = record.create({
                type: 'customrecord_s4_sns_folio'
            });
            // Set field values of the new record
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_debt',
                value: data.debt.toString()
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_cudebt',
                value: data.debt.toString()
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_customer',
                value: data.customer.toString()
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_distributor',
                value: data.distributor.toString()
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_item',
                value: data.item.toString()
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_folio_contract_date',
                value: formattedDate
            });
            // Save the new record
            const folioRecordId = newRecord.save();
            responseData.data.folioRecordId = folioRecordId;
        } catch (e) {
            responseData.code = 500;
            responseData.message = e.message;
            throw e;
        }
        return responseData;
    }


    function createTable(data, responseData) {
        try {
            const folioRecordId = responseData.data.folioRecordId;
            const newRecord = record.create({
                type: 'customrecord_s4_sns_conauto'
            });
            // Set field values of the new record
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_ca_folio',
                value: folioRecordId
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_ca_customer',
                value: data.customer.toString()
            });
            // Save the new record
            const tableRecordId = newRecord.save();
            responseData.data.tableRecordId = tableRecordId;

            record.submitFields({
                type: "customrecord_s4_sns_folio",
                id: folioRecordId,
                values: {
                    custrecord_s4_sns_folio_invoice: tableRecordId
                }
            });
        } catch (e) {
            responseData.code = 500;
            responseData.message = e.message;
        }
        return responseData;
    }

    function createDetail(data, responseData) {
        try {
            let tableRecordId;
            if (!responseData.data.tableRecordId) {
                tableRecordId = data.maintable;
            } else {
                tableRecordId = responseData.data.tableRecordId;
            }

            const newRecord = record.create({
                type: 'customrecord_s4_sns_detail'
            });
            // Set field values of the new record
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_conauto_link',
                value: tableRecordId
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_da_month',
                value: data.month
            });
            newRecord.setValue({
                fieldId: 'custrecord_s4_sns_da_quantity',
                value: data.quantity
            });
            // Save the new record
            const detailRecordId = newRecord.save();
            responseData.data.detailRecordId = detailRecordId;
        } catch (e) {
            responseData.code = 500;
            responseData.message = e.message;
        }
        return responseData;
    }

    function updateFields(data, responseData) {
        try {
            let tableRecordId;
            if (!responseData.data.tableRecordId) {
                tableRecordId = data.maintable;
            } else {
                tableRecordId = responseData.data.tableRecordId;
            }

            let folioRecordId;
            if (!responseData.data.folioRecordId) {
                folioRecordId = data.maininvoice;
            } else {
                folioRecordId = responseData.data.folioRecordId;
            }

            const currentDebt = record.load({
                type: 'customrecord_s4_sns_folio',
                id: folioRecordId
            }).getValue('custrecord_s4_sns_folio_cudebt');
            let newDebt = currentDebt - data.quantity;
            record.submitFields({
                type: "customrecord_s4_sns_folio",
                id: folioRecordId,
                values: {
                    custrecord_s4_sns_folio_cudebt: newDebt
                }
            });

            record.submitFields({
                type: "customrecord_s4_sns_conauto",
                id: tableRecordId,
                values: {
                    custrecord_s4_sns_ca_debt: newDebt,
                }
            });
        } catch (e) {
            responseData.code = 500;
            responseData.message = e.message;
        }
        return responseData;
    }

    function validateFolioData(data) {
        if (!data.debt || !data.customer || !data.distributor || !data.item) {
            return "Falta uno o más campos obligatorios";
        }
        if (!Number.isInteger(data.debt) || !Number.isInteger(data.customer) || !Number.isInteger(data.distributor) || !Number.isInteger(data.item)) {
            return "Los campos debt, customer, distributor, e item deben ser números enteros.";
        }
        try {
            const customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: data.customer
            });
        } catch (error) {
            if (error.code === "INVALID_FLD_VALUE" || error.code === "RCRD_DSNT_EXIST") {
                return "El ID del cliente proporcionado no es válido";
            }
            return error.message;
        }

    }
    return {
        post: post
    };
});