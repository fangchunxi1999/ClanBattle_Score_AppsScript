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
        "Form สำหรับกรอบคะแนน Clan Battle"
    );

    var items: ItemData[] = [
        {
            title: "เลือกชื่อ Member Clan",
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData(memberList),
                isRequired: true,
            },
        },
        {
            title: "เลือกบอสที่ตี",
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData([1, 2, 3, 4, 5].map((i) => "" + i)),
                isRequired: true,
            },
        },
        {
            title: "เลือกรอบ",
            type: FormApp.ItemType.LIST,
            option: {
                choices: arrayToChoicesData(["1", "2+"].map((i) => "" + i)),
                isRequired: true,
            },
        },
        {
            title: "กรอกคะแนน",
            type: FormApp.ItemType.TEXT,
            option: {
                textValidation: FormApp.createTextValidation()
                    .requireWholeNumber()
                    .build(),
                isRequired: true,
            },
        },
        {
            title: "มี Overflow ต่อไหม",
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
            title: "ข้อมูล Overflow",
            type: FormApp.ItemType.PAGE_BREAK,
            option: {
                goToPage: FormApp.PageNavigationType.SUBMIT,
            },
        },
        {
            title: "เวลาที่เหลือจาก Overflow",
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
    setConfig("CURRENT_LINKED_SPREADSHEET_ID", form.getDestinationId());
    setConfig("CURRENT_LINKED_SHEET_ID", destSheet.getSheetId().toString());

    saveConfigsToSheet(dataSpreadsheet.getSheetByName("CONFIG"));
    destSpreadsheet.setActiveSheet(destSheet);
}
