function removeAllFormSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
        var s = sheets[i];
        var formUrl = s.getFormUrl();
        if (formUrl != null) {
            var f = FormApp.openByUrl(formUrl);
            f.removeDestination();
            ss.deleteSheet(s);
        }
    }
}

function getAllSheetFormUrl_DEBUG() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
        var s = sheets[i];
        console.log(s.getFormUrl());
        console.log(s.getName());
        console.log(s.getIndex());
    }
}
