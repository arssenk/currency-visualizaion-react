import React from "react";
import {connect} from "react-redux";
import {updateTableInput} from "../actions/index";
import {compose, mapProps} from "recompose";
import {convertCurrency, getCurrencyImagePath} from "../helpers/utils";
import "../styles/ConvertTable.css";


const mapStateToProps = state => {
    // console.log("convert table map", state)
    return {
        data: Object.values(state.data),
        percentageBoxChecked: state.percentageBoxChecked,
        todayCurrencies: Object.values(state.currencyHistory)[ Object.values(state.currencyHistory).length - 1],
        selectedCurrency: state.selectedCurrency
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateTableInput: (curr, value, key) => dispatch(updateTableInput(curr, value, key)),
    };
};
//TODO need to pass every prop
const addConvertedValues = mapProps((props) => ({
    ...props,
    data: props.data.map(cur => ({
        ...cur,
        converted: convertCurrency(cur.savings, props.todayCurrencies[cur.currency], props.todayCurrencies[props.selectedCurrency])
    }))
}));


const ConnectedConvertTable = ({data, updateTableInput, selectedCurrency, percentageBoxChecked}) => {

    return (
        <section>
            <table className="ConvertTable__table">
                <thead>
                <tr>
                    <th className="ConvertTable__title">Сбережения</th>
                    <th className="ConvertTable__title">В моей валюте, {selectedCurrency}</th>
                    <th className="ConvertTable__title">Ставки вкладов</th>
                </tr>
                </thead>
                <tbody>
                {data.map((el, i) => (
                    <tr key={i}>
                        {/*<td >*/}
                            {/**/}

                        {/*</td>*/}
                        <td className="ConvertTable__image-container">
                            <img src={getCurrencyImagePath(el.currency)} className="ConvertTable__currency-img"
                                 alt={el.currency}/>
                            <input
                                className="ConvertTable__input-exchange"
                                value={el.savings}
                                onChange={evt => updateTableInput(el.currency, evt.target.value, "savings")}
                            />
                        </td>
                        <td><output className="ConvertTable__output-exchange">{el.converted}</output>
                            </td>
                        <td>
                            <input
                                className="ConvertTable__input-percentage-form"
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
