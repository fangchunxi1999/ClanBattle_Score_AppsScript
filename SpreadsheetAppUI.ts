function setupSpreadsheetAppUI() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Custom Menu")
        .addItem("Create new Score Form", "createFormUI")
        .addSeparator()
        .addItem("Backup Config to CONFIG Sheet", "saveConfigsToSheetUI")
        .addItem("Load Config form CONFIG Sheet", "loadConfigsFormSheetUI")
        .addSeparator()
        .addItem(
            "Delete old onFormSubmit Triggers",
            "delOldOnFormSubmitTriggersUI"
        )
        .addToUi();
}

function createFormUI() {
    var ui = SpreadsheetApp.getUi();
    var result = ui.prompt(
        "Setting new Score Form name",
        "Please input new Form name:",
        ui.ButtonSet.OK_CANCEL
    );
    if (result.getSelectedButton() == ui.Button.OK) {
        var formName = result.getResponseText().trim();
        if (formName === "") {
            ui.alert("Please Input Form name!");
            return;
        }
    }
    setupFormAndSheet(formName, SpreadsheetApp.getActiveSpreadsheet(), {
        MEMBER_LIST_NAMED_RANGE: getConfig("MEMBER_LIST_NAMED_RANGE"),
    });
}

function saveConfigsToSheetUI() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        "CONFIG"
    );
    saveConfigsToSheet(configSheet);
}

function loadConfigsFormSheetUI() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        "CONFIG"
    );
    loadConfigsFormSheet(configSheet);
}

function delOldOnFormSubmitTriggersUI() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        "CONFIG"
    );
    var currentTriggerID = getConfig(
        "CURRENT_FORM_TRIGGER_ID",
        configSheet.getRange("A1:B")
    );
    delOldOnFormSubmitTriggers(currentTriggerID);
}
