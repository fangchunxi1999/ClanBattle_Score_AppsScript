function prepareFormLinkedSheet(
    form: GoogleAppsScript.Forms.Form,
    insertInfo: {
        SUBMIT_URL_STR: string;
        EDIT_URL_STR: string;
        RESPONSE_URL_STR: string;
    },
    linkedSheet?: GoogleAppsScript.Spreadsheet.Sheet
) {
    if (!linkedSheet) linkedSheet = getFormDestinationSheet(form);
    insertFormUrlToLinkedSheet(form, insertInfo, linkedSheet);
    setCellsProperties(linkedSheet);
}

//TODO
function setCellsProperties(
    linkedSheet: GoogleAppsScript.Spreadsheet.Sheet
): GoogleAppsScript.Spreadsheet.Sheet {
    var writeCells = linkedSheet.getRange("A5:E");
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
    setFormat(writeCells, formatInfos);
    return linkedSheet;
}

function setFormat(
    range: GoogleAppsScript.Spreadsheet.Range,
    formatInfos: { format: string; col: number }[]
): GoogleAppsScript.Spreadsheet.Range {
    var numberFormats = range.getNumberFormats();
    for (let fInfo of formatInfos)
        for (let r = 0; r < numberFormats.length; r++)
            for (let c = 0; c < numberFormats[r].length; c++)
                if (c + 1 == fInfo.col) numberFormats[r][c] = fInfo.format;

    return range.setNumberFormats(numberFormats);
}

//TODO
function insertFormUrlToLinkedSheet(
    form: GoogleAppsScript.Forms.Form,
    insertInfo: {
        SUBMIT_URL_STR: string;
        EDIT_URL_STR: string;
        RESPONSE_URL_STR: string;
    },
    linkedSheet?: GoogleAppsScript.Spreadsheet.Sheet
): GoogleAppsScript.Spreadsheet.Sheet {
    if (!linkedSheet) linkedSheet = getFormDestinationSheet(form);
    var writeValues = [
        [insertInfo.SUBMIT_URL_STR, form.getPublishedUrl()],
        [insertInfo.EDIT_URL_STR, form.getEditUrl()],
        [insertInfo.RESPONSE_URL_STR, form.getSummaryUrl()],
    ];
    var writeCells = linkedSheet.getRange(1, 1, writeValues.length, 2);
    var readValues = writeCells.getValues();
    var isInserted = true;
    for (let i = 0; i < readValues.length; i++)
        if (readValues[i][0] !== writeValues[i][0]) isInserted = false;
    if (!isInserted) linkedSheet.insertRowsBefore(1, 3);
    writeCells.setValues(writeValues);
    return linkedSheet;
}

function getAllNamedRanges(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
): GoogleAppsScript.Spreadsheet.NamedRange[] {
    return spreadsheet.getNamedRanges();
}

function getNamedRange(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    rangeName: string
): GoogleAppsScript.Spreadsheet.NamedRange | null {
    var namedRanges = getAllNamedRanges(spreadsheet);
    for (let i = 0; i < namedRanges.length; i++)
        if (namedRanges[i].getName() === "MEMBER_LIST") return namedRanges[i];
    return null;
}

function memberListFromRange(
    range: GoogleAppsScript.Spreadsheet.Range
): string[] {
    var memberList: Array<string> = [];
    var _memberList = range.getValues();
    var count = 0;
    for (let i = 0; i < _memberList.length; i++) {
        for (let j = 0; j < _memberList[i].length; j++) {
            var member = _memberList[i][j];
            if (member) {
                memberList[count++] = member;
            }
        }
    }
    return memberList;
}
