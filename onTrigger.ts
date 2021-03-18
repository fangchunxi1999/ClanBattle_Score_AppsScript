function onOpen(e) {
    setupSpreadsheetAppUI();
}

function formOnSummit(e) {
    //TODO
}

function addFormOnSubmitTrigger(
    form: GoogleAppsScript.Forms.Form,
    triggerFnName = "formOnSummit"
) {
    return ScriptApp.newTrigger(triggerFnName)
        .forForm(form)
        .onFormSubmit()
        .create();
}
