function onOpen(e) {
    setupSpreadsheetAppUI();
}

function formOnSummit(e) {
    //TODO

    //debug
    //getCellFormat_DEBUG(e.range);
}

function addFormOnSubmitTrigger(
    form: GoogleAppsScript.Forms.Form,
    triggerFnName = "formOnSummit"
): GoogleAppsScript.Script.Trigger {
    return ScriptApp.newTrigger(triggerFnName)
        .forForm(form)
        .onFormSubmit()
        .create();
}

function delOldOnFormSubmitTriggers(currentTriggerID: string) {
    var triggers = ScriptApp.getProjectTriggers();
    for (let trigger of triggers) {
        if (trigger.getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
            if (trigger.getUniqueId() != currentTriggerID) {
                ScriptApp.deleteTrigger(trigger);
            }
        }
    }
}
