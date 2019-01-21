import {
    ADD_PREDICTION_POINTS,
    DATA_LOADED,
    UPDATE_CURRENCY_BASE,
    UPDATE_PERCENTAGE_BOX,
    UPDATE_PREDICTION_POINT,
    UPDATE_SELECTED_CURRENCY,
    UPDATE_TABLE_INPUT
} from "../constants/action-types";
import {
    COLORS_FOR_CURRENCY,
    COLORS_FOR_PERCENTAGE_CURRENCY,
    INITIAL_CHOSEN_CURRENCY, INITIAL_DATA, SUPPORTED_CURRENCIES,
    SUPPORTED_CURRENCIES_ALL, SUPPORTED_CURRENCIES_TXT
} from "../constants/config";
import {CURRENCY_HISTORY, DATA_MOVING} from "../constants/currencyHistory";

const initialState = {
    data: INITIAL_DATA,
    currencyHistory: CURRENCY_HISTORY,
    selectedCurrency: INITIAL_CHOSEN_CURRENCY,
    percentageBoxChecked: false,
    currencyPredictionPoints: DATA_MOVING,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    supportedCurrenciesAll: SUPPORTED_CURRENCIES_ALL,
    supportedCurrenciesTxt: SUPPORTED_CURRENCIES_TXT,
    colorsForCurrency: COLORS_FOR_CURRENCY,
    colorsForPercentageCurrency: COLORS_FOR_PERCENTAGE_CURRENCY

};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TABLE_INPUT:
            return {
                ...state,
                data: {
                    ...state.data, [action.currency]: {
                        ...state.data[action.currency], [action.key]: +action.value //TODO should i convert string to int here?
                    }
                }
            };

        case UPDATE_SELECTED_CURRENCY:
            return {
                ...state,
                selectedCurrency: action.currencyName
            };

        case UPDATE_PERCENTAGE_BOX:
            return {
                ...state,
                percentageBoxChecked: !state.percentageBoxChecked
            };

        case UPDATE_PREDICTION_POINT:
            return {
                ...state,
                currencyPredictionPoints: {
                    ...state.currencyPredictionPoints,
                    [action.date]: {
                        ...state.currencyPredictionPoints[action.date],
                        [action.curr]: 1 / (action.value)
                    }
                }
            };

        case UPDATE_CURRENCY_BASE:
            return {
                ...state,
                //TODO does it remain immutable
                currencyHistory: action.rebasedCurrencyHistory,
                currencyPredictionPoints: action.rebasedPredictionPoints
            };

        case DATA_LOADED:
            return Object.assign({}, state, {
                currencyHistory: action.payload
            });

        case ADD_PREDICTION_POINTS:
            return Object.assign({}, state, {
                currencyPredictionPoints: action.predictionPoints
            });
        default:
            console.log("default reduser")
            return state;
    }
};

export default rootReducer;

