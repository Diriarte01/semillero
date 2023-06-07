/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 *@author Catalina R
 */
define(["N/ui/serverWidget", 'N/task', 'N/https', "N/error"],
    (serverWidget, task, https, error) => {
        const handlers = {};
        const fields = {
            url: "custpage_s4_url",
            method: "custpage_s4_method",
            entity: "custpage_s4_entity",
            id: "custpage_s4_id",
        };
        const selectMethod = [
            { text: "", value: "-1", isSelected: true },
            { text: "Traer Información", value: false, isSelected: false },
            { text: "Traer un dato en especifico", value: true, isSelected: false },
        ]
        const selectEntity = [
            { text: "", value: "-1", isSelected: true },
            { text: "Caracter", value: "character", isSelected: false },
            { text: "Lugares", value: "location", isSelected: false },
            { text: "Episodio", value: "episode", isSelected: false }
        ]
        const consumeOk = (entity, form) => {
            const fieldHtml = form.addField({
                id: "custpage_s4_html",
                label: "Show custom script",
                type: "INLINEHTML",
            })
            let html = `
            <div>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500&display=swap');
                h1 {
                    color:green;
                    font-size:20px;
                    font-family: 'Mukta', sans-serif;
                    font-weight: bold;
                }
            </style>
            <h1>La entidad ${entity} se ha cosultado correctamente </h1>
            </div>
            `
            fieldHtml.defaultValue = html
        }
        const errorCustom = (entity, form) => {
            const fieldhtml = form.addField({
                id: 'custpage_s4_html_err',
                label: 'Error',
                type: 'INLINEHTML',
            })
            let html = `
                <div>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500&display=swap');
                    h1 {
                        color:red; 
                        font-size:20px; 
                        font-family: 'Mukta', sans-serif;
                        font-weight: bold;
                    }
                </style>
                <h1>La entidad ${entity}, no se pudo consultar correctamente, vuelva a intentarlo más tarde</h1>
                </div>
            `
            fieldhtml.defaultValue = html
            let err = error.create({
                message: `No se pudo consultar correctamente ${entity}`,
                name: "ERROR_CONSUME_API",
            })
            throw err;
        }
        handlers.onRequest = (context) => {
            const request = context.request
            const response = context.response
            const params = request.parameters
            const form = serverWidget.createForm({ title: "Rick & Morty Api" })
            form.clientScriptFileId = 9082
            try {
                if (request.method === "GET") {
                    form.addSubmitButton({ label: "Consumir API" })
                    form.addFieldGroup({
                        id: "custpage_s4_data_group",
                        label: "Datos",
                    })
                    const fieldUrl = form.addField({
                        id: fields.url,
                        label: "Url Estatica",
                        type: "TEXT",
                        container: "custpage_s4_data_group"
                    })
                    fieldUrl.defaultValue = "https://rickandmortyapi.com/api"
                    fieldUrl.isMandatory = true
                    fieldUrl.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE })
                    const fieldMethod = form.addField({
                        id: fields.method,
                        label: "Metodo",
                        type: "SELECT",
                        container: "custpage_s4_data_group"
                    })
                    fieldMethod.isMandatory = true
                    selectMethod.forEach(method => fieldMethod.addSelectOption({ value: method.value, text: method.text, isSelected: method.isSelected }))
                    const fieldEntity = form.addField({
                        id: fields.entity,
                        label: "Entidad",
                        type: "SELECT",
                        container: "custpage_s4_data_group"
                    })
                    fieldEntity.isMandatory = true
                    selectEntity.forEach((entity) => fieldEntity.addSelectOption({ value: entity.value, text: entity.text, isSelected: entity.isSelected }))
                    const fieldId = form.addField({
                        id: fields.id,
                        label: "Id's",
                        type: "TEXT",
                        container: "custpage_s4_data_group"
                    })
                    fieldId.updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED })
                } else {
                    form.title = "Ok"
                    form.addButton({
                        id: "custpage_s4_button_home",
                        label: "Volver",
                        functionName: "home()"
                    })
                    let url = params[fields.url]
                    if (params[fields.method] == "true") {
                        url += "/" + params[fields.id]
                        log.debug("URL: ", url)
                    }
                    const entity = params[fields.entity]
                    const consume = https.get({
                        url: url,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    if (consume.code == "404" || consume.code == "500") {
                        errorCustom(entity, form)
                    } else {
                        const tasks = task.create({
                            taskType: task.TaskType.MAP_REDUCE,
                            scriptId: "customscript_s4_sns_rym_mr",
                            deploymentId: "customdeploy_s4_sns_rym_mr",
                            params: {
                                "custscript_s4_sns_api_rym": consume.body,
                                "custscript_s4_sns_parameter_entity": entity
                            }
                        })
                        const okTask = tasks.submit()
                        const summary = task.checkStatus({
                            taskId: okTask
                        })
                        if (summary.status == "PENDING" || summary.status == "COMPLETE") {
                            consumeOk(entity, form);
                            switch (entity) {
                                case "location":
                                    location(form, JSON.parse(consume.body))
                                    break;
                                case "character":
                                    character(form, JSON.parse(consume.body))
                                    break;
                                case "episode":
                                    episode(form, JSON.parse(consume.body))
                                    break;
                            }
                        }else{
                            errorCustom(entity, form)
                        }
                    }

                }
            } catch (error) {
                log.error("Failed to create form", error.message)
            } finally {
                response.writePage(form)
            }
        }
        const location = (form, body) => {
            const locationCreator = [
                "custpage_s4_sns_rym_sub_location",
                "custpage_s4_sns_rym_location_id",
                "custpage_s4_sns_rym_location_name",
                "custpage_s4_sns_rym_location_type",
                "custpage_s4_sns_rym_location_dimension",
                "custpage_s4_sns_rym_location_residents",
                "custpage_s4_sns_rym_location_url",
                "custpage_s4_sns_rym_location_created",
            ]
            const sublistLocation = form.addSublist({
                id: locationCreator[0],
                label: "Lugares",
                type: "STATICLIST"
            })
            sublistLocation.addField({
                id: locationCreator[1],
                label: "ID",
                type: "TEXT",
            })
            sublistLocation.addField({
                id: locationCreator[2],
                label: "Nombre",
                type: "TEXT",
            })
            sublistLocation.addField({
                id: locationCreator[3],
                label: "Tipo",
                type: "TEXT",
            })
            sublistLocation.addField({
                id: locationCreator[4],
                label: "Dimensión",
                type: "TEXT",
            })
            sublistLocation.addField({
                id: locationCreator[5],
                label: "Residentes",
                type: "URL",
            })
            sublistLocation.addField({
                id: locationCreator[6],
                label: "URL",
                type: "URL",
            })
            sublistLocation.addField({
                id: locationCreator[7],
                label: "Creado",
                type: "TEXT",
            })
            let bool = false
            let c;
            let resultOne = {}
            if (body.length == undefined && !body.results) {
                resultOne.one = body
            } else if (body.length > 0 && !body.results) {
                bool = true
            } else {
                bool = true
                body = body.results
            }
            if (Array.isArray(body) && bool) {
                c = 0
                body.forEach(rs => {
                    let length = 1
                    Object.entries(rs).forEach(([key, value]) => {
                        sublistLocation.setSublistValue({
                            id: locationCreator[length],
                            line: c,
                            value: value
                        })
                        length++
                    })
                    c++
                })
            } else {
                let length = 1
                c = 0
                Object.entries(body).forEach(([key, value]) => {
                    sublistLocation.setSublistValue({
                        id: locationCreator[length],
                        line: c,
                        value: value
                    })
                    length++
                })
            }
        }
        const character = (form, body) => {
            const characterCreator = [
                "custpage_s4_sns_rym_sub_character",
                "custpage_s4_sns_rym_character_id",
                "custpage_s4_sns_rym_character_name",
                "custpage_s4_sns_rym_character_status",
                "custpage_s4_sns_rym_character_species",
                "custpage_s4_sns_rym_character_type",
                "custpage_s4_sns_rym_character_gender",
                "custpage_s4_sns_rym_character_origin",
                "custpage_s4_sns_rym_character_character",
                "custpage_s4_sns_rym_character_image",
                "custpage_s4_sns_rym_character_episode",
                "custpage_s4_sns_rym_character_url",
                "custpage_s4_sns_rym_character_created",
            ]
            const sublistCharacter = form.addSublist({
                id: characterCreator[0],
                label: "Caracteres",
                type: "STATICLIST"
            })
            sublistCharacter.addField({
                id: characterCreator[1],
                label: "ID",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[2],
                label: "Nombre",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[3],
                label: "Estado",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[4],
                label: "Especie",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[5],
                label: "Tipo",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[6],
                label: "Genero",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[7],
                label: "Origen",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[8],
                label: "Lugares",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[9],
                label: "Imagen",
                type: "TEXT",
            })
            sublistCharacter.addField({
                id: characterCreator[10],
                label: "Episodio",
                type: "URL",
            })
            sublistCharacter.addField({
                id: characterCreator[11],
                label: "Url",
                type: "URL",
            })
            sublistCharacter.addField({
                id: characterCreator[12],
                label: "Creado",
                type: "TEXT",
            })

            let bool = false
            let c;
            let resultOne = {}
            if (body.length == undefined && !body.results) {
                resultOne.one = body
            } else if (body.length > 0 && !body.results) {
                bool = true
            } else {
                bool = true
                body = body.results
            }
            if (Array.isArray(body) && bool) {
                c = 0
                body.forEach(rs => {
                    let length = 1
                    Object.entries(rs).forEach(([key, value]) => {
                        sublistCharacter.setSublistValue({
                            id: characterCreator[length],
                            line: c,
                            value: value == "" ? value = " "
                                : typeof value == "object" && value.length > 0 ? value
                                    : typeof value == "object" ? value.name : value
                        })
                        length++
                    })
                    c++
                })
            } else {
                let length = 1
                c = 0
                Object.entries(body).forEach(([key, value]) => {
                    sublistCharacter.setSublistValue({
                        id: characterCreator[length],
                        line: c,
                        value: value == "" ? value = " "
                            : typeof value == "object" && value.length > 0 ? value
                                : typeof value == "object" ? value.name : value
                    })
                    length++
                })
            }
        }
        const episode = (form, body) => {
            const episodeCreator = [
                "custpage_s4_sns_rym_sub_episode",
                "custpage_s4_sns_rym_episode_id",
                "custpage_s4_sns_rym_episode_name",
                "custpage_s4_sns_rym_episode_type",
                "custpage_s4_sns_rym_episode_dimension",
                "custpage_s4_sns_rym_episode_residents",
                "custpage_s4_sns_rym_episode_url",
                "custpage_s4_sns_rym_episode_created",
            ]
            const sublistEpisode = form.addSublist({
                id: episodeCreator[0],
                label: "Episodios",
                type: "STATICLIST"
            })
            sublistEpisode.addField({
                id: episodeCreator[1],
                label: "ID",
                type: "TEXT",
            })
            sublistEpisode.addField({
                id: episodeCreator[2],
                label: "Nombre",
                type: "TEXT",
            })
            sublistEpisode.addField({
                id: episodeCreator[3],
                label: "Tipo",
                type: "TEXT",
            })
            sublistEpisode.addField({
                id: episodeCreator[4],
                label: "Dimensión",
                type: "TEXT",
            })
            sublistEpisode.addField({
                id: episodeCreator[5],
                label: "Residentes",
                type: "URL",
            })
            sublistEpisode.addField({
                id: episodeCreator[6],
                label: "URL",
                type: "URL",
            })
            sublistEpisode.addField({
                id: episodeCreator[7],
                label: "Creado",
                type: "TEXT",
            })
            let bool = false
            let c;
            let resultOne = {}
            if (body.length == undefined && !body.results) {
                resultOne.one = body
            } else if (body.length > 0 && !body.results) {
                bool = true
            } else {
                bool = true
                body = body.results
            }
            if (Array.isArray(body) && bool) {
                c = 0
                body.forEach(rs => {
                    let length = 1
                    Object.entries(rs).forEach(([key, value]) => {
                        sublistEpisode.setSublistValue({
                            id: episodeCreator[length],
                            line: c,
                            value: value
                        })
                        length++
                    })
                    c++
                })
            } else {
                let length = 1
                c = 0
                Object.entries(body).forEach(([key, value]) => {
                    sublistEpisode.setSublistValue({
                        id: episodeCreator[length],
                        line: c,
                        value: value

                    })
                    length++
                })
            }
        }
        return handlers;
    });
