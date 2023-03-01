/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record'], 
    function(serverWidget, record){

        function onRequest(context) {
            const response = context.response;
            const request = context.request;
            const params = request.parameters;
            const form  = serverWidget.createForm({title:'Suitelet - Semillero'});

            const field = {
                compane: 'custpage_s4_company',
                date: 'custpage_s4_date',
                description : 'custpage_s4_description',
                html: 'custpage_s4_html',
            }

            const sublistData = {
                id:'custpage_s4_sbl_inf',
                fields:{
                    internalId: 'custpage_s4_sbl_internal_id',
                    name: 'custpage_s4_sbl_name',
                    phone: 'custpage_s4_sbl_phone'
                }
            }

            try{
                if(request.method === 'GET'){
                    log.debug('context - Get', context)
                    form.title = form.title + ' - metodo Get'
                    form.addSubmitButton({ label: 'Enviar Datos'})
                    const fielGroup = form.addFieldGroup({
                        id: 'custpage_s4_fiel_group',
                        label: 'Información de la empresa',
                    })
                    
                    const company = form.addField({
                        id: field.compane,
                        label: 'Compañia',
                        type: 'select',
                        source: '-117',
                        container: 'custpage_s4_fiel_group'
                    })
                    company.isMandatory = true;
                    
                    const date = form.addField({
                        id: field.date,
                        label: 'Fecha Actual',
                        type: 'date',
                        container: 'custpage_s4_fiel_group'
                    })
                    date.defaultValue = new Date ();
                    
                    const description = form.addField({
                        id: field.description,
                        label: 'Descripción',
                        type: 'text',
                        container: 'custpage_s4_fiel_group'
                    })
                    description.maxLength = 40;
                    
                    const sublist = form.addSublist({ id: sublistData.id, label: 'Transacciones',  type: 'list' });
                    sublist.addField({
                        id: sublistData.fields.internalId,
                        label: 'Internal ID',
                        type: 'integer',
                    })
                    
                    sublist.addField({
                        id: sublistData.fields.name,
                        label: 'nombre',
                        type: 'text',
                    })
                    
                    sublist.addField({
                        id: sublistData.fields.phone,
                        label: 'Telefono',
                        type: 'text',
                    })
                }else{
                    form.title = form.title + ' - metodo Post';
                    const objRecord = record.create({ type:'location' })
                    objRecord.setValue('name', params[field.description])
                    objRecord.setValue('subsidiary', params[field.compane])
                    const saveRecord = objRecord.save();
                    const fieldhtml = form.addField({
                        id: field.html,
                        label: 'Descripción',
                        type: 'INLINEHTML',
                        container: 'custpage_s4_fiel_group'
                    })
                    let html = `
                        <div>
                            <p style= background-color = 'green'>
                                se ha creado una nueva ubicacion que tiene un id interno ${saveRecord}
                            </p>
                        </div>
                    `   
                    fieldhtml.defaultValue = html
                    log.debug('context - post', context)
                }  

            }catch(e){
                    log.error('Hubo un error en la ejecución', e.message)
            }finally{
                response.writePage(form)
            }

        }

        return {
            onRequest: onRequest
        }
    }
);
