function setupConfigSheet(
    configSheet: GoogleAppsScript.Spreadsheet.Sheet,
    configSheetName = "CONFIG",
    row = 1,
    column = 1
) {
    //TODO
}

function getKeys(): string[] {
    var docProps = PropertiesService.getDocumentProperties();
    return docProps.getKeys();
}

function getConfigs(
    range?: GoogleAppsScript.Spreadsheet.Range
): { [key: string]: string } {
    if (range) {
        var props = rangeToProperties(range);
    } else {
        var docProps = PropertiesService.getDocumentProperties();
        var props = docProps.getProperties();
    }
    return props;
}

function getConfig(
    key: string,
    fallbackRange?: GoogleAppsScript.Spreadsheet.Range
): string {
    var docProps = PropertiesService.getDocumentProperties();
    var prop = docProps.getProperty(key);
    if (!prop && fallbackRange) {
        prop = rangeToProperties(fallbackRange)[key];
    }
    if (prop) return prop;
    else throw new Error("Not Found KEY: " + key);
}

function setConfigs(
    configs: { [key: string]: string },
    deleteAllOthers = false
): void {
    var docProps = PropertiesService.getDocumentProperties();
    docProps.setProperties(configs, deleteAllOthers);
}

function setConfig(key: string, value: string): void {
    var docProps = PropertiesService.getDocumentProperties();
    docProps.setProperty(key, value);
}

function deleteAllConfigs(): void {
    var docProps = PropertiesService.getDocumentProperties();
    docProps.deleteAllProperties();
}

function deleteConfig(key: string): void {
    var docProps = PropertiesService.getDocumentProperties();
    docProps.deleteProperty(key);
}

function saveConfigsToSheet(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    row = 1,
    column = 1,
    deleteAllOthers = false
) {
    var configsProp = getConfigs();
    if (!deleteAllOthers) {
        var readCell = sheet.getRange(row, column, sheet.getLastRow(), 2);
        var configsPropOld = rangeToProperties(readCell);
        for (let configKey in configsProp) {
            configsPropOld[configKey] = configsProp[configKey];
        }
        var configsPropNew = configsPropOld;
    } else {
        var configsPropNew = configsProp;
    }
    var configsValue = propertiesToArray(configsPropNew);
    deleteAllConfigsOnSheet(sheet, row, column);
    sheet.getRange(row, column, configsValue.length, 2).setValues(configsValue);
}

function loadConfigsFormSheet(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    row = 1,
    column = 1,
    numRow = sheet.getLastRow(),
    deleteAllOthers = false
) {
    var readCell = sheet.getRange(row, column, numRow, 2);
    var configsProp = rangeToProperties(readCell);
    setConfigs(configsProp, deleteAllOthers);
}

function deleteAllConfigsOnSheet(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    row = 1,
    column = 1,
    numRow = sheet.getLastRow()
) {}

function rangeToProperties(
    range: GoogleAppsScript.Spreadsheet.Range
): { [key: string]: string } {
    var values = range.getValues();
    return arrayToProperties(values);
}

function arrayToProperties(cellValues: string[][]): { [key: string]: string } {
    if (cellValues[0].length != 2)
        throw new Error(
            "Configs range requires 2 column as key/value pair, but got" +
                cellValues.length
        );
    var configs: { [key: string]: string } = {};
    for (let i = 0; i < cellValues.length; i++) {
        let _key = cellValues[i][0];
        let _value = cellValues[i][1];
        configs[_key] = _value;
    }
    return configs;
}

function propertiesToArray(configs: { [key: string]: string }): string[][] {
    var cellValues: string[][] = [];
    for (let configKey in configs)
        cellValues.push([configKey, configs[configKey]]);
    return cellValues;
}
