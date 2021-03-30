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

    var form = createForm(
        "[Clan Battle]" + formName,
        getConfig("FORM_DESCRIPTION")
    );

    form = setFormItems(form, items);
    form = setFormDestinationSheet(form, destSpreadsheet);

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
    setCellsProperties(destSheet);

    const titleRange = destSheet.getRange(
        destSheet.getLastRow(),
        1,
        1,
        destSheet.getLastColumn()
    );
    const titleInfos: TitleInfo[] = [
        {
            titleName: "DATETIME",
            titleCol: 1,
        },
        {
            titleName: "MEMBER",
            titleDisplayStr: getConfig("FORM_GET_MEMBER_NAME_TITLE"),
        },
        {
            titleName: "BOSS",
            titleDisplayStr: getConfig("FORM_GET_BOSS_TITLE"),
        },
        {
            titleName: "STATE",
            titleDisplayStr: getConfig("FORM_GET_TURN_TITLE"),
        },
        {
            titleName: "SCORE",
            titleDisplayStr: getConfig("FORM_GET_SCORE_TITLE"),
        },
        {
            titleName: "HAS_OVERFLOW",
            titleDisplayStr: getConfig("FORM_GET_HAS_OVERFLOW_TITLE"),
        },
        {
            titleName: "OVERFLOW_TIME",
            titleDisplayStr: getConfig("FORM_GET_OVERFLOW_TITLE"),
        },
    ];
    var titlesData = getTitle(titleRange.getValues(), titleInfos);
    saveTitlesDataToConfig(titlesData);

    setConfig("CURRENT_FORM_ID", form.getId());
    if (!hasSheetOnSubmitTrigger()) {
        var formTrigger = addSheetOnSubmitTrigger(destSpreadsheet);
        setConfig("CURRENT_FORM_TRIGGER_ID", formTrigger.getUniqueId());
    }
    setConfig("CURRENT_LINKED_SPREADSHEET_ID", form.getDestinationId());
    setConfig("CURRENT_LINKED_SHEET_ID", destSheet.getSheetId().toString());

    saveConfigsToSheet(dataSpreadsheet.getSheetByName("CONFIG"));
    destSpreadsheet.setActiveSheet(destSheet);
}
