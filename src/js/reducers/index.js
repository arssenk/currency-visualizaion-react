import {
    ADD_NEW_CURRENCY,
    ADD_PREDICTION_POINTS, ALLOW_RENDERING,
    DATA_LOADED,
    UPDATE_CURRENCY_BASE, UPDATE_MODAL_SHOW,
    UPDATE_PERCENTAGE_BOX,
    UPDATE_PREDICTION_POINT,
    UPDATE_SELECTED_CURRENCY,
    UPDATE_TABLE_INPUT
} from "../constants/action-types";
import {
    COLORS_FOR_CURRENCY,
    COLORS_FOR_PERCENTAGE_CURRENCY, CURRENCIES_SYMBOLS, HIDDEN_CURRENCIES,
    INITIAL_CHOSEN_CURRENCY, INITIAL_DATA, SUPPORTED_CURRENCIES,
    SUPPORTED_CURRENCIES_ALL, SUPPORTED_CURRENCIES_TXT, X_LABELS_BAR_CHART, X_LABELS_LINE_CHART
} from "../constants/config";
import {CURRENCY_HISTORY, DATA_MOVING} from "../constants/currencyHistory";

const initialState = {
    data: INITIAL_DATA,
    currencyHistory: CURRENCY_HISTORY,
    selectedCurrency: INITIAL_CHOSEN_CURRENCY,
    percentageBoxChecked: false,
    currencyPredictionPoints: DATA_MOVING,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    hiddenCurrencies: HIDDEN_CURRENCIES,
    supportedCurrenciesAll: SUPPORTED_CURRENCIES_ALL,
    supportedCurrenciesTxt: SUPPORTED_CURRENCIES_TXT,
    colorsForCurrency: COLORS_FOR_CURRENCY,
    colorsForPercentageCurrency: COLORS_FOR_PERCENTAGE_CURRENCY,
    xLabelsLineChart: X_LABELS_LINE_CHART,
    xLabelsBarChart: X_LABELS_BAR_CHART,
    showModal: false,
    currencyPredictionPointsHidden: [],
    currencyHistoryHidden:{},
    symbols:CURRENCIES_SYMBOLS,
    allowRendering:false

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
            console.log("changing percentaag to ", !state.percentageBoxChecked)
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
            console.log("data loaded")

            return Object.assign({}, state, {
                currencyHistory: action.supportedCurrenciesHistory,
                currencyHistoryHidden:action.hiddenCurrenciesHistory
            });

        case ADD_PREDICTION_POINTS:
            console.log("ADD_PREDICTION_POINTS")

            return Object.assign({}, state, {
                currencyPredictionPoints: action.predictionPoints,
                currencyPredictionPointsHidden: action.predictionPointsHidden
            });
        case UPDATE_MODAL_SHOW:
            //TODO change to be immputable
            console.log("changing modal show to ", !state.showModal);
            return{
                ...state,
                showModal: !state.showModal
            };
        case ADD_NEW_CURRENCY:
            // console.log("in add new cur red", action, {
            //     ...state,
            //     currencyHistory: action.payload.currencyHistoryModified,
            //     currencyHistoryHidden: action.payload.currencyHistoryHiddenModifies,
            //     currencyPredictionPoints: action.payload.currencyPredictionPointsModified,
            //     currencyPredictionPointsHidden: action.payload.currencyPredictionPointsHiddenModifies,
            //     supportedCurrencies:action.payload.supportedCurrenciesNew,
            //     hiddenCurrencies:action.payload.hiddenCurrenciesNew,
            //     data:action.payload.newData
            // })
            return {
                ...state,
                currencyHistory: action.payload.currencyHistoryModified,
                currencyHistoryHidden: action.payload.currencyHistoryHiddenModifies,
                currencyPredictionPoints: action.payload.currencyPredictionPointsModified,
                currencyPredictionPointsHidden: action.payload.currencyPredictionPointsHiddenModifies,
                supportedCurrencies:action.payload.supportedCurrenciesNew,
                hiddenCurrencies:action.payload.hiddenCurrenciesNew,
                data:action.payload.newData
            };
        case ALLOW_RENDERING:
            console.log("alliwinf render",!state.allowRendering)
            return {
                ...state,
                allowRendering: !state.allowRendering
            };
        default:
            console.log("default reduser")
            return state;
    }
};

export default rootReducer;

