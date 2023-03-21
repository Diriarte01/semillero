/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Catalina R
 */
define(['N/ui/dialog', 'N/url'],
    function (dialog, url) {

        /* creamos el objeto de los campos creados en el suitelet */
        const fields = {
            apiUrl: 'custpage_api_url',
            parameter: 'custpage_api_paramater',
            typePetition: 'custpage_api_type_petition',
            paramsText: 'custpage_api_params_text'
        }

        const handlers = {};

        handlers.fieldChanged = (context) => {
            const obj = context.currentRecord;
            /* Traemos el id del campo en el que estamos en ese momento */
            const fieldId = context.fieldId;
            try {
                /* Si estamos en alcun campo, entra  */
                if (fieldId != null) {
                    /* Traemos netamente el id del campo en el que estamos */
                    const fieldValue = obj.getValue(fieldId);
                    /* Entramos si esta en alguno de los campos hará lo especificado */
                    switch (fieldId) {
                        /* si es la peticion Todo o Especifico */
                        case fields.typePetition:
                            /* getField trae un objeto del campo, el cual trae todas las propiedades de este  */
                            const fieldProperty = obj.getField(fields.paramsText);
                            if (fieldValue == 'true') {
                                /* Si el Value del select que elegimos es igual a true,
                                cambiaran las siguentes propiedades del campo "PARAMETRO DE TEXTO" */
                                fieldProperty.isDisabled = false;
                                fieldProperty.isMandatory = true;
                            } else {
                                /* Si se llega a cambiar el valor vuelve a su estado deshabilitado y cambia el 
                                valor para que no aparezca nada */
                                fieldProperty.isDisabled = true;
                                fieldProperty.isMandatory = false;
                                obj.setValue(fields.paramsText, null)
                            }
                            break;
                        case fields.parameter:
                            /* Si es el parametro(seccion de platzi), la que vamosa usar, se concatenará dicho
                            url con el value del campo seleccionado */
                            const domainApi = 'https://api.escuelajs.co/api/v1/';
                            obj.setValue(fields.apiUrl, domainApi + fieldValue)
                            break;
                    }
                }
            } catch (e) {
                console.log('Hubo un error', e)
            }
        }

        handlers.validateField = (context) => {
            try {
                const obj = context.currentRecord;
                const fieldId = context.fieldId;
                /* Si  el campo en que estamos es igual al campo "PARAMETRO DE TEXTO" entra*/
                console.log("Mi script")
                if ( fieldId == fields.paramsText) {
                    /* Traemos el value del campo PARAMETRO DE TEXTO */
                    const fieldValue = Number(obj.getValue(fieldId));
                    if (isNaN(fieldValue) || typeof fieldValue != 'number') {
                        /* Si no es un numero nos dará esta alerta */
                        dialog.alert({
                            title: 'Error',
                            message: 'En este campo solo se aceptan numeros Enteros'
                        })
                    }
                }
                return true;
            } catch (e) {
                console.log('Hubo un erorr', e)
            }
        }

        handlers.home = () => {
            const urlSs = url.resolveScript({
                /* Despliegue de nuestro script y el id*/
                deploymentId: 'customdeploy_s4_sns_sl_test_union',
                scriptId: 'customscript_s4_sns_sl_test_union',
            })
            window.location.replace(urlSs)
        }
        return handlers

    }
);
