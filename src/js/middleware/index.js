import {
    ADD_PREDICTION_POINTS,
    DATA_LOADED,
    UPDATE_CURRENCY_BASE,
    UPDATE_SELECTED_CURRENCY
} from "../constants/action-types";
import {generatePredictionPoints, processJson, rebaseCurrency, sortObjectByDate} from "../helpers/utils";

export function rebaseApiDataMiddleware({getState, dispatch}) {
    return function (next) {
        return function (action) {
            // do your stuff
            switch (action.type) {

                case DATA_LOADED :
                    //TODO add hidden curr hist variable
                    let result = processJson(action.payload, getState().supportedCurrencies);
                    result = sortObjectByDate(result);
                    result = rebaseCurrency(result, getState().selectedCurrency);

                    //TODO ok to change payload this way?
                    action.payload = result;


                    //Update currency history
                    next(action);

                    return dispatch({type: ADD_PREDICTION_POINTS});
                case ADD_PREDICTION_POINTS:
                    let todayCurrencies = Object.values(getState().currencyHistory)[Object.values(getState().currencyHistory).length - 1]


                    let predictionPoints = generatePredictionPoints(todayCurrencies, getState().supportedCurrencies,
                        getState().selectedCurrency);
                    action.predictionPoints = predictionPoints;

                    return next(action);

                case UPDATE_SELECTED_CURRENCY :

                    //Update selected currency
                    next(action);

                    //TODO ok to pass currencyHistory, currencyPoints?
                    let rebasedCurrencyHistory = rebaseCurrency(getState().currencyHistory, getState().selectedCurrency);
                    let rebasedPredictionPoints = rebaseCurrency(getState().currencyPredictionPoints, getState().selectedCurrency);

                    //Rebase currency
                    return dispatch({type: UPDATE_CURRENCY_BASE, rebasedCurrencyHistory, rebasedPredictionPoints})

                default:
                    return next(action);
            }
        };
    };
}