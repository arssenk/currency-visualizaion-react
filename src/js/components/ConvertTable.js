import React from "react";
import {connect} from "react-redux";
import {updateCurrencyInput, updateTableInput} from "../actions/index";
import {compose, mapProps} from "recompose";
import {convertCurrency, getCurrencyImagePath} from "../helpers/utils";
import "../styles/ConvertTable.scss";


const mapStateToProps = state => {
    return {
        data: Object.values(state.data),
        percentageBoxChecked: state.percentageBoxChecked,
        todayCurrencies: state.currencyHistory[state.currencyHistory.length - 1],
        selectedCurrency: state.selectedCurrency
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateTableInput: (curr, value, key) => dispatch(updateTableInput(curr, value, key)),
    };
};
//TODO need to pass every prop
const addConvertedValues = mapProps(({data, todayCurrencies, percentageBoxChecked, selectedCurrency, updateTableInput}) => ({
    data: data.map(cur => ({
        ...cur,
        converted: convertCurrency(cur.savings, todayCurrencies[cur.currency], todayCurrencies[selectedCurrency])
    })),
    selectedCurrency,
    updateTableInput,
    percentageBoxChecked
}));


const ConnectedConvertTable = ({data, updateTableInput, selectedCurrency, percentageBoxChecked}) => {

    return (
        <section>
            <table>
                <thead>
                <tr>
                    <th>Сбережения</th>
                    <th>В моей валюте, {selectedCurrency}</th>
                    <th>Ставки вкладов</th>
                </tr>
                </thead>
                <tbody>
                {data.map((el, i) => (
                    <tr key={i}>
                        <td >
                            <img src={getCurrencyImagePath(el.currency)} className="convert-table__currency-img"
                                 alt={el.currency}/>

                        </td>
                        <td className="convert-table__input-exchange">
                            <input
                                value={el.savings}
                                onChange={evt => updateTableInput(el.currency, evt.target.value, "savings")}
                            />
                        </td>
                        <td>{el.converted}</td>
                        <td>
                            <input
                                disabled={(!percentageBoxChecked) ? "disabled" : ""}
                                value={el.percentage}
                                onChange={evt => updateTableInput(el.currency, evt.target.value, "percentage")}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button>Add</button>
        </section>
    );
};

//TODO check if its ok to convert here(react component shouldn't know about business logic of the app)
const enhancer = compose(connect(mapStateToProps, mapDispatchToProps), addConvertedValues);
const ConvertTable = enhancer(ConnectedConvertTable);


export default ConvertTable;
