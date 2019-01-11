import {UPDATE_PERCENTAGE_BOX, UPDATE_SELECTED_CURRENCY, UPDATE_TABLE_INPUT} from "../constants/action-types";
import {INITIAL_CHOSEN_CURRENCY, INITIAL_DATA} from "../constants/config";
import {CURRENCY_HISTORY} from "../constants/currencyHistory";

const initialState = {
    data: INITIAL_DATA,
    currencyHistory: CURRENCY_HISTORY,
    selectedCurrency: INITIAL_CHOSEN_CURRENCY,
    percentageBoxChecked: false
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

        default:
            return state;
    }
};

export default rootReducer;