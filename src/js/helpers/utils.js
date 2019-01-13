export function converter(value) {
    return value * 3
}
export function convertCurrency(number, convertFrom, convertTo) {
    return number * convertTo / convertFrom
}
export function getCurrencyImagePath(currencyName) {
    return "../img/" + currencyName + ".svg"
}

//Check for current year
export function isCurrentYear(date, currentDate) {
    let thisMonth = parseInt(date.split("-")[1]);
    let thisYear = parseInt(date.split("-")[0]);
    let thisDay = parseInt(date.split("-")[2]);
    let currYear = parseInt(currentDate.split("-")[0]);
    let currMonth = parseInt(currentDate.split("-")[1]);
    let currDay = parseInt(currentDate.split("-")[2]);

    if ((currYear > thisYear) || ((currYear === thisYear) && (currMonth > thisMonth))) {
        return true
    }
    else return (currYear === thisYear) && (currMonth === thisMonth) && (currDay >= thisDay);
}
