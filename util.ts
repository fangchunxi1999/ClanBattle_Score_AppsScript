function getIdFromUrl(url: string) {
    try {
        console.log(url); //Debug
        var match = url.match(/[\w-]{25,}/);
        console.log(match[0]); //Debug
        return match[0];
    } catch (error) {
        console.error(error);
        return;
    }
}
