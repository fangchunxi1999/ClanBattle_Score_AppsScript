interface ChoiceData {
    value: string;
    option?: {
        goToPage?: GoogleAppsScript.Forms.PageNavigationType;
        goToPageItem?: GoogleAppsScript.Forms.PageBreakItem;
    };
}
interface ItemData {
    title: string;
    type: GoogleAppsScript.Forms.ItemType;
    option: {
        choices?: ChoiceData[];
        textValidation?: GoogleAppsScript.Forms.TextValidation;
        helpText?: string;
        goToPage?: GoogleAppsScript.Forms.PageNavigationType;
        goToPageItem?: GoogleAppsScript.Forms.PageBreakItem;
        isRequired?: boolean;
    };
}

function createForm(
    formName: string,
    formDescription?: string
): GoogleAppsScript.Forms.Form {
    var form = FormApp.create(formName);
    if (formDescription) form.setDescription(formDescription);
    return form;
}

function setFormDestinationSheet(
    form: GoogleAppsScript.Forms.Form,
    destSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
): GoogleAppsScript.Forms.Form {
    form.setDestination(
        FormApp.DestinationType.SPREADSHEET,
        destSpreadsheet.getId()
    );
    return form;
}

function setFormItems(
    form: GoogleAppsScript.Forms.Form,
    items: ItemData[]
): GoogleAppsScript.Forms.Form {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.type == FormApp.ItemType.LIST)
            setListItem(form.addListItem(), item.title, item.option);
        else if (item.type == FormApp.ItemType.TEXT)
            setTextItem(form.addTextItem(), item.title, item.option);
        else if (item.type == FormApp.ItemType.MULTIPLE_CHOICE)
            setMultipleChoiceItem(
                form.addMultipleChoiceItem(),
                item.title,
                item.option
            );
        else if (item.type == FormApp.ItemType.PAGE_BREAK)
            setPageBreakItem(form.addPageBreakItem(), item.title, item.option);
        else throw new Error("Not implemented item type: " + item.type);
    }
    return form;
}

function setListItem(
    item: GoogleAppsScript.Forms.ListItem,
    title: string,
    option: {
        choices?: ChoiceData[];
        helpText?: string;
        isRequired?: boolean;
    }
): GoogleAppsScript.Forms.ListItem {
    if (!option.choices) throw new Error("Choices not found");
    item.setTitle(title);

    item.setChoices(createChoices(item, option.choices));

    if (option.helpText) item.setHelpText(option.helpText);
    if (option.isRequired) item.setRequired(option.isRequired);

    return item;
}

function setMultipleChoiceItem(
    item: GoogleAppsScript.Forms.MultipleChoiceItem,
    title: string,
    option: {
        choices?: ChoiceData[];
        helpText?: string;
        isRequired?: boolean;
    }
): GoogleAppsScript.Forms.MultipleChoiceItem {
    if (!option.choices) throw new Error("Choices not found");
    item.setTitle(title);

    item.setChoices(createChoices(item, option.choices));

    if (option.helpText) item.setHelpText(option.helpText);
    if (option.isRequired) item.setRequired(option.isRequired);

    return item;
}

function setTextItem(
    item: GoogleAppsScript.Forms.TextItem,
    title: string,
    option?: {
        textValidation?: GoogleAppsScript.Forms.TextValidation;
        helpText?: string;
        isRequired?: boolean;
    }
): GoogleAppsScript.Forms.TextItem {
    item.setTitle(title);

    if (option.textValidation) item.setValidation(option.textValidation);
    if (option.helpText) item.setHelpText(option.helpText);
    if (option.isRequired) item.setRequired(option.isRequired);

    return item;
}

function setPageBreakItem(
    item: GoogleAppsScript.Forms.PageBreakItem,
    title: string,
    option?: {
        goToPage?: GoogleAppsScript.Forms.PageNavigationType;
        goToPageItem?: GoogleAppsScript.Forms.PageBreakItem;
        helpText?: string;
    }
) {
    item.setTitle(title);

    if (option.goToPage) item.setGoToPage(option.goToPage);
    if (option.goToPageItem) item.setGoToPage(option.goToPageItem);
    if (option.helpText) item.setHelpText(option.helpText);

    return item;
}

//Todo
function createChoice(
    item:
        | GoogleAppsScript.Forms.CheckboxItem
        | GoogleAppsScript.Forms.ListItem
        | GoogleAppsScript.Forms.MultipleChoiceItem,
    choice: ChoiceData
): GoogleAppsScript.Forms.Choice {
    if (choice.option) {
        if (choice.option.goToPage) {
            return item.createChoice(choice.value, choice.option.goToPage);
        } else if (choice.option.goToPageItem) {
            return item.createChoice(choice.value, choice.option.goToPageItem);
        }
    }
    return item.createChoice(choice.value);
}

function createChoices(
    item:
        | GoogleAppsScript.Forms.CheckboxItem
        | GoogleAppsScript.Forms.ListItem
        | GoogleAppsScript.Forms.MultipleChoiceItem,
    choices: ChoiceData[]
): GoogleAppsScript.Forms.Choice[] {
    var _choices: GoogleAppsScript.Forms.Choice[] = [];
    for (let i = 0; i < choices.length; i++) {
        let choice: ChoiceData = choices[i];
        _choices.push(createChoice(item, choice));
    }
    return _choices;
}

function getFormDestinationSheet(
    form: GoogleAppsScript.Forms.Form,
    destSpreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet
): GoogleAppsScript.Spreadsheet.Sheet {
    if (!destSpreadsheet)
        destSpreadsheet = SpreadsheetApp.openById(form.getDestinationId());
    var formID = form.getId();
    var sheets = destSpreadsheet.getSheets();
    for (let i = 0; i < sheets.length; i++) {
        var sheetFormUrl = sheets[i].getFormUrl();
        if (sheetFormUrl == null) continue;
        var sheetFormID = getIdFromUrl(sheetFormUrl);
        if (formID === sheetFormID) return sheets[i];
    }
    return;
}

function arrayToChoicesData(choices: string[]): ChoiceData[] {
    var _choices: ChoiceData[] = [];
    for (let c of choices) _choices.push({ value: c });
    return _choices;
}
