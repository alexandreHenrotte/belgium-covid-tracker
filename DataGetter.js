var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class dataGetter {
    parsedData;

    constructor() {}

    httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    parseHttpRequest(rawHttpData) {
        // regex
        const regexLocateBelgium = /Belgium.*?<\/tr>/si;
        const regexLocateValues = />.*</g;

        // parse data
        var parsedDataBelgium = rawHttpData.match(regexLocateBelgium);
        var parsedDataValues = parsedDataBelgium[0].match(regexLocateValues);

        // format data
        for (var i = 0; i < parsedDataValues.length; i++) {
            // raw value : >123<
            parsedDataValues[i] = parsedDataValues[i].replace('<', '').replace('>', '');
            // formatted value : 123
        }

        // return data
        return parsedDataValues;
    }

    increaseDecreaseFormatText(text) {
        var formattedText;

        if (text[0] == '+') {
            formattedText = text + " 📈"
        }
        else {
            formattedText = text + " 📉"
        }

        return formattedText;
    }
    
    getData_totalCases() {
        return this.parsedData[1];
    }
    getData_newCases() {
        this.parsedData[2] = this.increaseDecreaseFormatText(this.parsedData[2]);
        return this.parsedData[2];
    }
    getData_totalDeaths() {
        return this.parsedData[3];
    }
    getData_newDeaths() {
        this.parsedData[4] = this.increaseDecreaseFormatText(this.parsedData[4]);
        return this.parsedData[4];
    }

    updateData() {
        var webRawData = this.httpGet('https://www.worldometers.info/coronavirus/')
        this.parsedData = this.parseHttpRequest(webRawData);
    }
    
}



module.exports = dataGetter;