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
    Object.keys(currenciesArray).map((date) => {
        let baseCurr = currenciesArray[date][selectedCurrency]
        Object.keys(currenciesArray[date]).map((currencyName) => {
            if (currencyName !== "date") {
                // console.log("debig",  result)
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
    // console.log("formatCurrenciesForBarChart ", currencyPredictionPoints)
    let result = Object.keys(currencyPredictionPoints).map((currency) => ({
        ...Object.assign({}, ...Object.keys(currencyPredictionPoints[currency]).map((key) => {
                return supportedCurrencies.includes(key) ? {
                    [key]: convertFunction(data[key].savings, currencyPredictionPoints[currency][key],
                        currencyPredictionPoints[currency][selectedCurrency])
                } : {}
            }
        )),
        date: currencyPredictionPoints[currency].date
    }));
    return result
};


export function processJson(json, supportedCurrenciesAll) {
    let originalBase = json.base;
    let result = {};

    for (let date in json.rates) {
        // TODO remove line
        if (json.rates.hasOwnProperty(date)) {
            for (let currencyIndex = 0; currencyIndex < supportedCurrenciesAll.length; currencyIndex++) {

                let currentCurrency = supportedCurrenciesAll[currencyIndex];
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