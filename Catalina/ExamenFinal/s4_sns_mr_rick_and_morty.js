/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@author Catalina R
 */
define(["N/runtime", "N/record", "N/search", "N/file"],
    (runtime, record, search, file) => {

        const handlers = {}
        const script = runtime.getCurrentScript();

        handlers.getInputData = () => {
            try {
                const params = JSON.parse(script.getParameter({ name: "custscript_s4_sns_api_rym" }))
                let resultOne = {}
                if (params.length == undefined && !params.results) {
                    resultOne.one = params
                    return resultOne
                } else if (params.length > 0 && !params.results) {
                    return params
                }
                return params.results
            } catch (error) {
                log.error("Error GetInputData", error.message)
            }
        }
        const processLocation = (recordObj, obj) => {
            creatorObj = {
                custrecord_s4_sns_rym_location_id: obj.id,
                custrecord_s4_sns_rym_location_name: obj.name,
                custrecord_s4_sns_rym_location_type: obj.type,
                custrecord_s4_sns_rym_location_dimension: obj.dimension,
                custrecord_s4_sns_rym_location_residents: obj.residents,
                custrecord_s4_sns_rym_location_url: obj.url,
                custrecord_s4_sns_rym_location_created: obj.created,
            }
            const type = "customrecord_s4_sns_location_rym"
            const filters = [["custrecord_s4_sns_rym_location_id", "is", obj.id]]
            filters.push("AND", ["custrecord_s4_sns_rym_location_name", "is", obj.name])
            filters.push("AND", ["custrecord_s4_sns_rym_location_type", "is", obj.type])
            filters.push("AND", ["custrecord_s4_sns_rym_location_dimension", "is", obj.dimension])
            filters.push("AND", ["custrecord_s4_sns_rym_location_residents", "contains", obj.residents[0] == undefined ? "" : obj.residents[0]])
            filters.push("AND", ["custrecord_s4_sns_rym_location_url", "contains", obj.url])
            filters.push("AND", ["custrecord_s4_sns_rym_location_created", "is", obj.created])
            const columns = []
            const locationSearchObj = search.create({ type: type, filters: filters, columns: columns });
            const count = locationSearchObj.runPaged().count
            let data = []
            let keys = ""
            if (count == 0) {
                Object.entries(creatorObj).forEach(([key, value]) => {
                    keys = Object.keys(obj).join() + "\n"
                    if (Array.isArray(value)) {
                        recordObj.setValue(key, value.toString().replace(/,/g, " "))
                        data.push(value.toString().replace(/,/g, " "))
                    } else {
                        recordObj.setValue(key, value);
                        data.push(value)
                    }
                })
                let complete = keys + data
                let csvFile = file.create({
                    name: obj.name + "_" + obj.id + ".csv",
                    fileType: file.Type.CSV,
                    contents: complete,
                    folder: 3300,
                    encoding: file.Encoding.UTF8,
                })
                let csv = csvFile.save()
                log.debug("csv", csv)
                const idSave = recordObj.save()
                log.debug("Creado con exito", { idSaved: idSave, idCreated: obj.id })
            } else {
                log.debug("Este registro asi ya existe.", [obj.residents[0], typeof obj.residents[0], obj.url])
            }
        }
        const processCharacter = (recordObj, obj) => {
            creatorObj = {
                custrecord_s4_sns_rym_character_id: obj.id,
                custrecord_s4_sns_rym_name: obj.name,
                custrecord_s4_sns_rym_status: obj.status,
                custrecord_s4_sns_rym_species: obj.species,
                custrecord_s4_sns_rym_type: obj.type,
                custrecord_s4_sns_rym_gender: obj.gender,
                custrecord_s4_sns_rym_origin: obj.origin.name,
                custrecord_s4_sns_rym_location: obj.location.name,
                custrecord_s4_sns_rym_image: obj.image,
                custrecord_s4_sns_rym_episode: obj.episode,
                custrecord_s4_sns_rym_url: obj.url,
                custrecord_s4_sns_rym_created: obj.created,
            }
            
            const type = "customrecord_s4_sns_character_rym"
            const filters = [["custrecord_s4_sns_rym_character_id", "is", obj.id]]
            filters.push("AND", ["custrecord_s4_sns_rym_name", "is", obj.name])
            filters.push("AND", ["custrecord_s4_sns_rym_status", "is", obj.status])
            filters.push("AND", ["custrecord_s4_sns_rym_species", "is", obj.species])
            filters.push("AND", ["custrecord_s4_sns_rym_type", "is", obj.type])
            filters.push("AND", ["custrecord_s4_sns_rym_gender", "is", obj.gender])
            filters.push("AND", ["custrecord_s4_sns_rym_origin", "is", obj.origin.name])
            filters.push("AND", ["custrecord_s4_sns_rym_location", "is", obj.location.name])
            filters.push("AND", ["custrecord_s4_sns_rym_image", "contains", obj.image])
            filters.push("AND", ["custrecord_s4_sns_rym_episode", "contains", obj.episode[0] == undefined ? "" : obj.episode[0]])
            filters.push("AND", ["custrecord_s4_sns_rym_url", "contains", obj.url])
            filters.push("AND", ["custrecord_s4_sns_rym_created", "is", obj.created])
            const columns = []
            const characterSearchObj = search.create({ type: type, filters: filters, columns: columns });
            const count = characterSearchObj.runPaged().count
            let data = []
            let keys = ""
            if (count == 0) {
                Object.entries(creatorObj).forEach(([key, value]) => {
                    keys = Object.keys(obj).join() + "\n"
                    if (Array.isArray(value)) {
                        recordObj.setValue(key, value.toString().replace(/,/g, " "))
                        data.push(value.toString().replace(/,/g, " "))
                    } else {
                        recordObj.setValue(key, value);
                        data.push(value)
                    }
                })
                let complete = keys + data
                let csvFile = file.create({
                    name: obj.name + "_" + obj.id + ".csv",
                    fileType: file.Type.CSV,
                    contents: complete,
                    folder: 3301,
                    encoding: file.Encoding.UTF8,
                })
                let csv = csvFile.save()
                log.debug("csv", csv)
                const idSave = recordObj.save()
                log.debug("Creado con exito", { idSaved: idSave, idCreated: obj.id })
            } else {
                log.debug("Este registro asi ya existe.", obj.id)
            }
        }
        const processEpisode = (recordObj, obj) => {
            creatorObj = {
                custrecord_s4_sns_rym_episode_id: obj.id,
                custrecord_s4_sns_rym_episode_name: obj.name,
                custrecord_s4_sns_rym_episode_air_date: obj.air_date,
                custrecord_s4_sns_rym_episode_ep: obj.episode,
                custrecord_s4_sns_rym_episode_characters: obj.characters,
                custrecord_s4_sns_rym_episode_url: obj.url,
                custrecord_s4_sns_rym_episode_created: obj.created,
            }
            const type = "customrecord_s4_sns_episode_rym"
            const filters = [["custrecord_s4_sns_rym_episode_id", "is", obj.id]]
            filters.push("AND", ["custrecord_s4_sns_rym_episode_name", "is", obj.name])
            filters.push("AND", ["custrecord_s4_sns_rym_episode_air_date", "is", obj.air_date])
            filters.push("AND", ["custrecord_s4_sns_rym_episode_ep", "is", obj.episode])
            filters.push("AND", ["custrecord_s4_sns_rym_episode_characters", "contains", obj.characters[0] == undefined ? "" : obj.characters[0]])
            filters.push("AND", ["custrecord_s4_sns_rym_episode_url", "is", obj.url])
            filters.push("AND", ["custrecord_s4_sns_rym_episode_created", "is", obj.created])
            const columns = []
            const episodeSearchObj = search.create({ type: type, filters: filters, columns: columns });
            const count = episodeSearchObj.runPaged().count
            let data = []
            let keys = ""
            if (count == 0) {
                Object.entries(creatorObj).forEach(([key, value]) => {
                    keys = Object.keys(obj).join() + "\n"
                    if (Array.isArray(value)) {
                        recordObj.setValue(key, value.toString().replace(/,/g, " "))
                        data.push(value.toString().replace(/,/g, " "))
                    } else {
                        recordObj.setValue(key, value);
                        typeof value == "number" ? value = value.toString() : "";
                        value.includes(",") ? data.push(value.replace(",", "")) : data.push(value)
                    }
                })
                let complete = keys + data
                let csvFile = file.create({
                    name: obj.name + "_" + obj.id + ".csv",
                    fileType: file.Type.CSV,
                    contents: complete,
                    folder: 3302,
                    encoding: file.Encoding.UTF8,
                })
                let csv = csvFile.save()
                log.debug("csv", csv)
                const idSave = recordObj.save()
                log.debug("Creado con exito", { idSaved: idSave, idCreated: obj.id })
            } else {
                log.debug("Este registro asi ya existe.", obj.id)
            }
        }
        handlers.map = (context) => {
            try {
                const entity = script.getParameter({ name: "custscript_s4_sns_parameter_entity" })
                const obj = JSON.parse(context.value)
                log.debug("entity", entity)
                log.debug("context", context.key)
                const recordObj = record.create({ type: `customrecord_s4_sns_${entity}_rym` })
                switch (entity) {
                    case "location":
                        processLocation(recordObj, obj)
                        break;
                    case "character":
                        processCharacter(recordObj, obj)
                        break;
                    case "episode":
                        processEpisode(recordObj, obj)
                        break;
                }
            } catch (error) {
                log.error("Error Map", error.message)
            }
        }
        handlers.summarize = (context) => {
            try {
                x = context
                log.debug("context", x)
            } catch (error) {
                log.error("Error Summarize", error.message)
            }
        }

        return handlers;
    });
