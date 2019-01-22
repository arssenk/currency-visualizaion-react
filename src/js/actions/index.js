// src/js/actions/index.js

import {
    ADD_NEW_CURRENCY, ALLOW_RENDERING,
    DATA_LOADED,
    UPDATE_CURRENCY_BASE, UPDATE_MODAL_SHOW,
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
export const updatePercentageBox = () => ({
    type: UPDATE_PERCENTAGE_BOX
});
export const updatePredictionPoint = (curr, value, date) => ({
    type: UPDATE_PREDICTION_POINT,
    curr, value, date
});
export const updateCurrencyBase = (rebasedCurrencyHistory, rebasedPredictionPoints) => ({
    type: UPDATE_CURRENCY_BASE,
    rebasedCurrencyHistory, rebasedPredictionPoints
});

export const updateModalShow = () => ({
    type: UPDATE_MODAL_SHOW
});

export const addNewCurrency = (currencyName) => ({
    type: ADD_NEW_CURRENCY,
    currencyName
});

export const updateAllowRendering = () => ({
    type: ALLOW_RENDERING
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

