export function converter(value) {
    return value * 3
}
export function convertCurrency(number, convertFrom, convertTo) {
    return number * convertTo / convertFrom
}
export function getCurrencyImagePath(currencyName) {
    return "../img/" + currencyName + ".svg"
}