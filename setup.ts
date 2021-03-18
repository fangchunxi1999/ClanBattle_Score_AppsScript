function setupFormAndSheet(
    formName: string,
    destSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    setupInfo: { MEMBER_LIST_NAMED_RANGE: string },
    dataSpreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet
) {
    if (!dataSpreadsheet) dataSpreadsheet = destSpreadsheet;
    var memberList = memberListFromRange(
        getNamedRange(
            dataSpreadsheet,
            setupInfo.MEMBER_LIST_NAMED_RANGE
        ).getRange()
    );

    var form = createForm(
        "[Clan Battle]" + formName,
        getConfig("FORM_DESCRIPTION")
    );

    var items: ItemData[] = [
        {
            title: getConfig("FORM_GET_MEMBER_NAME_TITLE"),
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData(memberList),
                isRequired: true,
            },
        },
        {
            title: getConfig("FORM_GET_BOSS_TITLE"),
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData([1, 2, 3, 4, 5].map((i) => "" + i)),
                isRequired: true,
            },
        },
        {
            title: getConfig("FORM_GET_TURN_TITLE"),
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData(["1", "2+"].map((i) => "" + i)),
                isRequired: true,
            },
        },
        {
            title: getConfig("FORM_GET_SCORE_TITLE"),
            type: FormApp.ItemType.TEXT,
            option: {
                textValidation: FormApp.createTextValidation()
                    .requireWholeNumber()
                    .build(),
                isRequired: true,
            },
        },
        {
            title: getConfig("FORM_GET_HAS_OVERFLOW_TITLE"),
            type: FormApp.ItemType.MULTIPLE_CHOICE,
            option: {
                choices: [
                    {
                        value: "Yes",
                        option: {
                            goToPage: FormApp.PageNavigationType.CONTINUE,
                        },
                    },
                    {
                        value: "No",
                        option: { goToPage: FormApp.PageNavigationType.SUBMIT },
                    },
                ],
                isRequired: true,
            },
        },
        {
            title: getConfig("FORM_PAGE_OVERFLOW_TITLE"),
            type: FormApp.ItemType.PAGE_BREAK,
            option: {
                goToPage: FormApp.PageNavigationType.SUBMIT,
            },
        },
        {
            title: getConfig("FORM_GET_OVERFLOW_TITLE"),
            type: FormApp.ItemType.TEXT,
            option: {
                textValidation: FormApp.createTextValidation()
                    .requireTextMatchesPattern(
                        "^0?[01][:.]30$|^0?[01][:.][0-2]?[\\d]$"
                    )
                    .build(),
                helpText: 'กรอกในรูปแบบ "01:23" หรือ "1.23"',
                isRequired: true,
            },
        },
    ];

    form = setFormItems(form, items);
    form = setFormDestinationSheet(form, destSpreadsheet);
    var formTrigger = addFormOnSubmitTrigger(form);

    SpreadsheetApp.flush();
    var destSheet = getFormDestinationSheet(form, destSpreadsheet);
    destSheet.setName("[Form Response] " + formName);
    prepareFormLinkedSheet(
        form,
        {
            SUBMIT_URL_STR: getConfig("SHEET_SUBMIT_URL_STR"),
            EDIT_URL_STR: getConfig("SHEET_EDIT_URL_STR"),
            RESPONSE_URL_STR: getConfig("SHEET_RESPONSE_URL_STR"),
        },
        destSheet
    );
    setConfig("CURRENT_FORM_ID", form.getId());
    setConfig("CURRENT_FORM_TRIGGER_ID", formTrigger.getUniqueId());
    setConfig("CURRENT_LINKED_SPREADSHEET_ID", form.getDestinationId());
    setConfig("CURRENT_LINKED_SHEET_ID", destSheet.getSheetId().toString());

    saveConfigsToSheet(dataSpreadsheet.getSheetByName("CONFIG"));
    destSpreadsheet.setActiveSheet(destSheet);
}
