export const INITIAL_DATA =  {
    "RUB": {
        currency: "RUB",
        savings: 250000,
        percentage: 10,
        symbol: "₽"
    },
    "USD": {
        currency: "USD",
        savings: 10000,
        percentage: 4,
        symbol: "$"
    },
    "EUR": {
        currency: "EUR",
        savings: 8000,
        percentage: 3,
        symbol: "€"
    },
    "CNY": {
        currency: "CNY",
        savings: 6000,
        percentage: 2,
        symbol: "¥"
    }
};

export const INITIAL_CHOSEN_CURRENCY = "RUB";

export const SUPPORTED_CURRENCIES = ["RUB", "USD", "EUR", "CNY"];
export const SUPPORTED_CURRENCIES_TXT = ["₽", "$", "€", "¥"];

//Write new currency here when you want to add one
export const HIDDEN_CURRENCIES = ["GBP", "CAD", "PLN", "SGD"];
export const HIDDEN_CURRENCIES_TXT = ["₤", "C$", "zł", "S$"];

export const SUPPORTED_CURRENCIES_ALL = SUPPORTED_CURRENCIES.concat(HIDDEN_CURRENCIES);
export const SUPPORTED_CURRENCIES_ALL_TXT = SUPPORTED_CURRENCIES_TXT.concat(HIDDEN_CURRENCIES_TXT);

export const COLORS_FOR_CURRENCY = ["#0066cc", "#009933", "#ff9900", "#ff0000", "#b35900", "#862d59", "#F1EE19", "#D611CC"];
export const COLORS_FOR_PERCENTAGE_CURRENCY  = ["#66a3e0", "#66c285", "#ffb84d", "#ff4d4d", "#ff9933", "#d98cb3", "#FEFA01", "#FE01F0"];

export const URL_API = "https://api.exchangeratesapi.io/history?start_at=";
