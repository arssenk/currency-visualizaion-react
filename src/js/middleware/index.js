import {
    ADD_NEW_CURRENCY,
    ADD_PREDICTION_POINTS,
    DATA_LOADED,
    UPDATE_SELECTED_CURRENCY
} from "../constants/action-types";
import {
    generatePredictionPoints,
    moveCurrencyItems,
    processJson,
    rebaseCurrency,
    sortObjectByDate
} from "../helpers/utils";
import {updateAllowRendering, updateCurrencyBase} from "../actions/index";

export function rebaseApiDataMiddleware({getState, dispatch}) {
    return function (next) {
        return function (action) {
            // do your stuff
            switch (action.type) {

                case DATA_LOADED :
                    //TODO add hidden curr hist variable
                    let supportedCurrenciesHistory = sortObjectByDate(processJson(action.payload, getState().supportedCurrencies));
                    let hiddenCurrenciesHistory = sortObjectByDate(processJson(action.payload, getState().hiddenCurrencies));

                    // console.log("in get data toade",supportedCurrenciesHistory,"hod1", hiddenCurrenciesHistory)

                    supportedCurrenciesHistory = rebaseCurrency(supportedCurrenciesHistory, getState().selectedCurrency);
                    //TODO bug with rebasing
                    // hiddenCurrenciesHistory = rebaseCurrency(hiddenCurrenciesHistory, getState().selectedCurrency);

                    // console.log("in get data toade",supportedCurrenciesHistory,"hod 2", hiddenCurrenciesHistory)

                    //TODO ok to change payload this way?
                    action.supportedCurrenciesHistory = supportedCurrenciesHistory;
                    action.hiddenCurrenciesHistory = hiddenCurrenciesHistory;


                    //Update currency history
                    next(action);

                    dispatch({type: ADD_PREDICTION_POINTS});
                    return dispatch(updateAllowRendering());

                case ADD_PREDICTION_POINTS:
                    let todayCurrencies = Object.values(getState().currencyHistory)[Object.values(getState().currencyHistory).length - 1],
                        todayCurrenciesHidden = Object.values(getState().currencyHistoryHidden)[Object.values(getState().currencyHistoryHidden).length - 1];


                    let predictionPoints = generatePredictionPoints(todayCurrencies, getState().supportedCurrencies,
                        getState().selectedCurrency),
                        predictionPointsHidden = generatePredictionPoints(todayCurrenciesHidden, getState().hiddenCurrencies,
                            getState().selectedCurrency);

                    action.predictionPoints = predictionPoints;
                    action.predictionPointsHidden = predictionPointsHidden;

                    return next(action);

                case UPDATE_SELECTED_CURRENCY :

                    //Update selected currency
                    next(action);

                    //TODO ok to pass currencyHistory, currencyPoints from state?
                    let rebasedCurrencyHistory = rebaseCurrency(getState().currencyHistory, getState().selectedCurrency);
                    let rebasedPredictionPoints = rebaseCurrency(getState().currencyPredictionPoints, getState().selectedCurrency);

                    //Rebase currency
                    return dispatch(updateCurrencyBase(rebasedCurrencyHistory, rebasedPredictionPoints))

                //TODO from here
                case ADD_NEW_CURRENCY:

//Add curr Hist, pred points, remove item from modal w, remove from hidden curr list, add to supported

                    let [currencyHistoryHiddenModifies, currencyHistoryModified] = moveCurrencyItems(getState().currencyHistoryHidden,
                        getState().currencyHistory, action.currencyName);


                    let [currencyPredictionPointsHiddenModifies, currencyPredictionPointsModified] = moveCurrencyItems(getState().currencyPredictionPointsHidden,
                        getState().currencyPredictionPoints, action.currencyName);

                    // console.log("debggg", currencyPredictionPointsModified, currencyPredictionPointsHiddenModifies)
                    let supportedCurrenciesNew = getState().supportedCurrencies.concat([action.currencyName]);
                    let hiddenCurrenciesNew = getState().hiddenCurrencies.filter(currencyName => {
                        return currencyName !== action.currencyName
                    });

                    let newData = {
                        ...getState().data,
                        [action.currencyName]:{
                            savings:0,
                            percentage:0,
                            currency: action.currencyName,
                            symbol: getState().symbols[action.currencyName].symbol
                        }
                    };
                    action.payload = {
                        currencyHistoryModified, currencyHistoryHiddenModifies, currencyPredictionPointsModified,
                        currencyPredictionPointsHiddenModifies, supportedCurrenciesNew, hiddenCurrenciesNew, newData
                    };
                    next(action);
                    return dispatch(updateAllowRendering());

                default:
                    return next(action);
            }
        };
    };
}