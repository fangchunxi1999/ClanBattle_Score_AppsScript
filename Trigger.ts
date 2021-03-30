function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
    setupSpreadsheetAppUI();
}

function sheetOnSummit(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {
    var formatInfos = [
        {
            format: 'yyyy"/"mm"/"dd" "hh":"mm":"ss',
            col: 1,
        },
        {
            format: "#,##0",
            col: 5,
        },
    ];
    setFormat(e.range, formatInfos);

    if (
        e.range.getSheet().getSheetId().toString() !==
        getConfig("CURRENT_LINKED_SHEET_ID")
    ) {
        return;
    }
    //Todo

    //debug
    //getCellFormat_DEBUG(e.range);
}

function formOnSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {}

function hasSheetOnSubmitTrigger(): boolean {
    for (const trigger of ScriptApp.getProjectTriggers()) {
        if (
            trigger.getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT &&
            trigger.getTriggerSource() == ScriptApp.TriggerSource.SPREADSHEETS
        ) {
            return true;
        }
    }

    return false;
}

function addSheetOnSubmitTrigger(
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    triggerFnName = "sheetOnSummit"
): GoogleAppsScript.Script.Trigger {
    return ScriptApp.newTrigger(triggerFnName)
        .forSpreadsheet(spreadSheet)
        .onFormSubmit()
        .create();
}

function delOldOnFormSubmitTriggers(currentTriggerID: string) {
    const triggers = ScriptApp.getProjectTriggers();
    for (let trigger of triggers) {
        if (trigger.getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
            if (trigger.getUniqueId() != currentTriggerID) {
                ScriptApp.deleteTrigger(trigger);
            }
        }
    }
}
