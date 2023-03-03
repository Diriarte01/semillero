let conrtactData = [];
let contactSearchObj = search.create({
    type: "contact",
    filters:
        [
            ["internalid", "anyof", conttactId]
        ],
    columns:
        [
            search.createColumn({ name: "internalid", label: "ID interno" }),
            search.createColumn({ name: "entityid", label: "Nombre" }),
            search.createColumn({ name: "email", label: "Correo electrónico" }),
            search.createColumn({ name: "phone", label: "Teléfono" }),
            search.createColumn({ name: "company", label: "Empresa" }),
            search.createColumn({ name: "title", label: "Puesto de trabajo" })
        ]
});
/*  
 var searchResultCount = contactSearchObj.runPaged().count;
 log.debug("contactSearchObj result count",searchResultCount);
 */
contactSearchObj.run().each(function (result) {
    return true;
});
