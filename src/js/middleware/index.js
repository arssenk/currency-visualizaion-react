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
            if (action.type === DATA_LOADED) {
                let result = {};

                result = processJson(action.payload, getState().supportedCurrenciesAll);
                result = sortObjectByDate(result)
                result = rebaseCurrency(result, getState().selectedCurrency);

                //TODO ok to change payload this way?
                action.payload = result;


                //Update currency history
                next(action);

                let todayCurrencies = Object.values(getState().currencyHistory)[Object.values(getState().currencyHistory).length - 1]


                let predictionPoints = generatePredictionPoints(todayCurrencies, getState().supportedCurrencies,
                    getState().selectedCurrency);

                // action.predictionPoints = predictionPoints;
                console.log("rasdfasdf", predictionPoints)

                return dispatch({type: ADD_PREDICTION_POINTS, predictionPoints})


            }
            else if (action.type === UPDATE_SELECTED_CURRENCY) {


                //Update selected currency
                next(action);

                //TODO ok to pass currencyHistory, currencyPoints?
                let rebasedCurrencyHistory = rebaseCurrency(getState().currencyHistory, getState().selectedCurrency);
                let rebasedPredictionPoints = rebaseCurrency(getState().currencyPredictionPoints, getState().selectedCurrency);

                //Rebase currency
                return dispatch({type: UPDATE_CURRENCY_BASE, rebasedCurrencyHistory, rebasedPredictionPoints})
            }

            return next(action);
        };
    };
}