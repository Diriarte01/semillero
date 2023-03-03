



function fieldChanged(context) {
    if (context.fieldId == 'phone') {
        const obj = context.currrentRecord;
        const phone = obj.getValue('phone')
        obj.setValue('altphone', phone)
    }
}

return {
    pageInit: pageInit,
    fieldChanged: fieldChanged
}