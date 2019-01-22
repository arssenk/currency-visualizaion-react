export function convertCurrency(number, convertFrom, convertTo) {
    return number * convertTo / convertFrom
}
export function getCurrencyImagePath(currencyName) {
    return "../img/" + currencyName + ".svg"
}
export function convertToYYMMDDFormat(year, month, day) {
    return year + "-" +
        ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
}

export const rebaseCurrency = (currenciesArray, selectedCurrency) => {
    let result = {};
    Object.keys(currenciesArray).forEach((date) => {
        let baseCurr = currenciesArray[date][selectedCurrency];
        Object.keys(currenciesArray[date]).forEach((currencyName) => {
            if (currencyName !== "date") {
                result[date] = {
                    ...result[date],
                    [currencyName]: currenciesArray[date][currencyName] / baseCurr
                }
            }
            else {
                result[date]["date"] = currenciesArray[date]["date"]
            }
        })
    });
    return result;
};
export const formatCurrenciesForBarChart = (data, currencyPredictionPoints, supportedCurrencies, selectedCurrency, convertFunction) => {
    let resultFinal = {};
    Object.keys(currencyPredictionPoints).forEach((date) => {
        Object.keys(currencyPredictionPoints[date]).forEach((currencyName) =>{
            if (currencyName !== "date"){
                resultFinal[date] = {
                    ...resultFinal[date],
                    [currencyName]:convertFunction(data[currencyName].savings, currencyPredictionPoints[date][currencyName],
                        currencyPredictionPoints[date][selectedCurrency])
                };
            }
        });
        resultFinal[date]= {
            ...resultFinal[date],
            date: currencyPredictionPoints[date].date
        }

    });
   return resultFinal;
};


export function processJson(json, selectedCurrencies) {
    let originalBase = json.base;
    let result = {};
    for (let date in json.rates) {

        if (json.rates.hasOwnProperty(date)) {
            for (let currencyIndex = 0; currencyIndex < selectedCurrencies.length; currencyIndex++) {

                let currentCurrency = selectedCurrencies[currencyIndex];
                result[date] = {
                    ...result[date],
                    [currentCurrency]: json.rates[date][currentCurrency]
                }
            }
            result[date][originalBase] = 1;
            result[date]["date"] = date;
        }
    }
    return result;
}

export function sortObjectByDate(data) {
    let keys =  Object.keys(data).sort(function(a, b) {
        return new Date(a) - new Date(b)});
    let result = keys.map(id => {return {[id] :  data[id]}});
    return  Object.assign({}, ...result);

}


export function getStartEndDate() {
    //Current date
    let date = new Date();
    let resultStartDate = convertToYYMMDDFormat(date.getFullYear() - 1, date.getMonth() + 1, date.getDate());
    let resultEndDate = convertToYYMMDDFormat(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return [resultStartDate, resultEndDate]
}


export function formatTotalValue(val1, selectedCurrency) {
    return Math.round(val1) + " " + selectedCurrency;
}

export function generatePredictionPoints(lastCurrencies, supportedCurrencies, selectedCurrency) {
    let tmpDataItem;
    let result = {};
    let datesToAssign = createDatesAYearAhead(lastCurrencies.date);
    for (let dataIndex = 0; dataIndex <= 3; dataIndex++) {
        tmpDataItem = Object.assign({}, lastCurrencies);
        tmpDataItem.date = datesToAssign[dataIndex];
        let currCurrencies = supportedCurrencies.filter(item => item !== selectedCurrency);

        for (let currencyIndex = 0; currencyIndex < currCurrencies.length; currencyIndex++) {
            tmpDataItem[currCurrencies[currencyIndex]] -= tmpDataItem[currCurrencies[currencyIndex]]
                * (dataIndex) / 40
        }

        result[tmpDataItem.date]=tmpDataItem;

    }
    return result;
}


//Creating dates for prediction points
export function createDatesAYearAhead(currentDate) {
    let result = [];
    let currYear = parseInt(currentDate.split("-")[0]);
    let currMonth = parseInt(currentDate.split("-")[1]);
    let currDay = parseInt(currentDate.split("-")[2]);
    let monthToWrite = 0;
    let yearToWrite = 0;
    for (let i = 1; i <= 4; i++) {

        if (3 * i + currMonth > 12) {
            monthToWrite = 3 * i + currMonth - 12;
            yearToWrite = currYear + 1;
        }
        else {
            monthToWrite = 3 * i + currMonth;
            yearToWrite = currYear;
        }
        result.push(convertToYYMMDDFormat(yearToWrite, monthToWrite, currDay));
    }
    return result;
}


export function convertComplexPercentage(number, percentage, n) {
    return number * Math.pow(1 + percentage / 400, n) - number;
}

export function formatAllCurrencyNames(supportedCurrencies, percentageBoxChecked) {
    if (percentageBoxChecked){
        let result = [];
        supportedCurrencies.forEach(currencyName =>{
            result.push(currencyName);
            result.push(currencyName + "_percentage")
        });
        return result
    }
    else{
        return supportedCurrencies
    }
}
                                //hidd                  curHIst
export function moveCurrencyItems(currencyHistoryFrom, currencyHistoryTo, currencyName){
    let currencyHistoryFromResult = {},
        currencyHistoryToResult = Object.assign({}, currencyHistoryTo);

    Object.keys(currencyHistoryFrom).forEach(date =>{
        currencyHistoryToResult[date] = {
            ...currencyHistoryToResult[date],
            [currencyName]: currencyHistoryFrom[date][currencyName]
        };
        currencyHistoryFromResult[date] = {
            ...currencyHistoryFrom[date]
        };

        delete currencyHistoryFromResult[date][currencyName];
    });
    return [currencyHistoryFromResult, currencyHistoryToResult]

}