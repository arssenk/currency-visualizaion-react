// src/js/actions/index.js

import {UPDATE_TABLE_INPUT, UPDATE_PERCENTAGE_BOX, UPDATE_SELECTED_CURRENCY} from "../constants/action-types";

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
