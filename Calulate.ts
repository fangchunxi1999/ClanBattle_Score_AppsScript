interface TitleData {
    titleName: string;
    titleDisplayStr: string;
    titleCol: number;
}

interface TitleInfo {
    titleName: string;
    titleDisplayStr?: string;
    titleCol?: number;
}

function calMemberLeftTurn(
    memberName: string,
    data: any[][],
    memberCol: number,
    hasOverflowCol: number,
    maxTurn = 3,
    ignoreOverflow = false
) {
    for (const d of data) {
        if (memberName !== d[memberCol]) continue;
        if (d[hasOverflowCol] !== "" && !ignoreOverflow) maxTurn--;
    }

    return maxTurn;
}
function getRawData(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    startRow: number,
    startCol = 1
): any[][] {
    var numRow = sheet.getLastRow() - startRow + 1;
    var numCol = sheet.getLastColumn() - startCol + 1;
    var range = sheet.getRange(startRow, startCol, numRow, numCol);
    return range.getValues();
}
function trimTitle(rawData: any[][], titleRow = 1): any[][] {
    return rawData.slice(titleRow);
}
function getActiveDataByDate(
    data: any[][],
    startDatetime: Date,
    stopDatetime: Date,
    datetimeCol = 1
) {}

function getTitle(
    data: any[][],
    titleInfo: TitleInfo[],
    titleRow = 1
): TitleData[] {
    var titles = getTitleValues(data, titleRow);
    var titlesData: TitleData[] = [];

    for (const tInfo of titleInfo) {
        var tData: TitleData = {
            titleName: tInfo.titleName,
            titleDisplayStr: null,
            titleCol: null,
        };
        if (tInfo.titleCol) {
            tData.titleDisplayStr = String(titles[tInfo.titleCol - 1]);
            tData.titleCol = tInfo.titleCol;
        } else {
            for (let index = 0; index < titles.length; index++) {
                const tDisplayStr = String(titles[index]);
                if (tDisplayStr === "") continue;
                if (
                    tInfo.titleDisplayStr === tDisplayStr ||
                    tInfo.titleName === tDisplayStr
                ) {
                    tData.titleDisplayStr = tDisplayStr;
                    tData.titleCol = index + 1;
                    break;
                }
            }
        }
        titlesData.push(tData);
    }

    return titlesData;
}
function getTitleCol(titlesData: TitleData[], titleName: string): number {
    for (const tData of titlesData)
        if (titleName === tData.titleName) return tData.titleCol;
    return null;
}
function getTitleValues(data: any[][], titleRow = 1) {
    return data[titleRow - 1];
}

function saveTitlesDataToConfig(
    titlesData: TitleData[],
    configKey = "TITLES_DATA"
) {
    setConfig(configKey, JSON.stringify(titlesData));
}

function loadTitlesDataFromConfig(configKey = "TITLES_DATA"): TitleData[] {
    return JSON.parse(getConfig(configKey));
}
