/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Catalina R
 */
define(["N/ui/dialog", "N/url", "N/currentRecord"],
    (dialog, url, currentRecord) => {

        const handlers = {};

        const fields = {
            url: "custpage_s4_url",
            method: "custpage_s4_method",
            entity: "custpage_s4_entity",
            id: "custpage_s4_id",
        };

        handlers.saveRecord = (context) => {
            try {
                const current = context.currentRecord;
                const properties = current.getField(fields.id)
                const url = current.getValue(fields.url);
                const method = current.getValue(fields.method)
                const entity = current.getValue(fields.entity)
                const id = current.getValue(fields.id).split(",")
                const containsList = /^(\d+,)*\d+$/.test(id)
                if (url && method != "-1" && entity != "-1" && containsList && id.length <= 20) {
                    return true;
                }
            } catch (error) {
                console.log("Error en el save", error.message)
            }
        } 
        // 12774144 radicado avvillas
        handlers.validateField = (context) => {
            try {
                const current = context.currentRecord;
                const fieldId = context.fieldId
                if (fieldId == fields.id) {
                    const ids = current.getValue(fields.id).split(",")
                    const fieldValue = current.getValue(fieldId)
                    const containsList = /^(\d+,)*\d+$/.test(fieldValue)
                    const properties = current.getField(fields.id)
                    console.log("propiedades", properties.isDisabled)
                    
                    if (containsList == false && properties.isDisabled == false) {
                        dialog.alert({
                            title: "Advertencia!",
                            message: "El campo Id no soporta letras ni carácteres especiales, cambie el valor para poder continuar"
                        })
                        console.log("letra")
                    }
                    if (ids.length > 20) {
                        dialog.alert({
                            title: "Advertencia!!",
                            message: "Ha pasado el limite permitido, solo puede contener 20 id's"
                        })
                    }
                }
                return true
            } catch (error) {
                console.log("Error en el Validate", error.message)
            }
        }

        handlers.fieldChanged = (context) => {
            const current = context.currentRecord;
            const fieldId = context.fieldId;
            try {
                const fieldValue = current.getValue(fieldId)
                switch (fieldId) {
                    case fields.method:
                        const properties = current.getField(fields.id)
                        if (fieldValue == "true") {
                            properties.isDisabled = false;
                        } else {
                            properties.isDisabled = true;
                            console.log("ok campo id")
                            current.setValue(fields.id, "")
                        }
                        break;
                    case fields.entity:
                        const staticUrl = "https://rickandmortyapi.com/api/"
                        current.setValue(fields.url, staticUrl + fieldValue)
                        break;
                }
            } catch (error) {
                console.log("Error en el Changed", error.message)
            }
        }
        handlers.home = () => {
            const api = url.resolveScript({
                /* Despliegue de nuestro script y el id*/
                deploymentId: 'customdeploy_s4_sns_rick_and_morty',
                scriptId: 'customscript_s4_sns_rick_and_morty',
            })
            window.location.replace(api)
        }

        return handlers;
    });
