// src/js/actions/index.js

import {
    DATA_LOADED,
    UPDATE_CURRENCY_BASE,
    UPDATE_PERCENTAGE_BOX,
    UPDATE_PREDICTION_POINT,
    UPDATE_SELECTED_CURRENCY,
    UPDATE_TABLE_INPUT
} from "../constants/action-types";
import {getStartEndDate} from "../helpers/utils";
import {URL_API} from "../constants/config";

export const updateTableInput = (currency, value, key) => ({
    type: UPDATE_TABLE_INPUT,
    currency, value, key
});
export const updateSelectedCurrency = (currencyName) => ({
    type: UPDATE_SELECTED_CURRENCY,
    currencyName
});
export const updatePercentageBox = (percentageBoxChecked) => ({
    type: UPDATE_PERCENTAGE_BOX
});
export const updatePredictionPoint = (curr, value, date) => ({
    type: UPDATE_PREDICTION_POINT,
    curr, value, date
});
export const updateCurrencyBase = (currencyHistory, currencyPredictionPoints) => ({
    type: UPDATE_CURRENCY_BASE,
    currencyHistory, currencyPredictionPoints
});

export function getData() {
    return function (dispatch) {
        let [startDate, endDate] = getStartEndDate();
        return fetch(URL_API + startDate + "&end_at=" + endDate)
            .then(response => response.json())
            .then(json => {
                dispatch({type: DATA_LOADED, payload: json});
            });
    };
}

