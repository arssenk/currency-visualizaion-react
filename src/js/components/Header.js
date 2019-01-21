import React from "react";
//TODO check if correctly imported
import "../styles/Header.scss";
import {updateCurrencyBase, updatePercentageBox, updateSelectedCurrency} from "../actions/index";
import {connect} from "react-redux";
import {compose} from "redux";


const mapStateToProps = state => {
    return {
        data: Object.values(state.data),
        selectedCurrency: state.selectedCurrency,
        currencyPredictionPoints: state.currencyPredictionPoints,
        currencyHistory: state.currencyHistory,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSelectedCurrency: (currencyName) => dispatch(updateSelectedCurrency(currencyName)),
        updatePercentageBox: (percentageBoxChecked) => dispatch(updatePercentageBox(percentageBoxChecked)),
        updateCurrencyBase: (data, currencyPredictionPoints, currencyName) => dispatch(updateCurrencyBase(data, currencyPredictionPoints, currencyName)),
    };
};

const ConnectedHeader = ({data, selectedCurrency, updateSelectedCurrency, updatePercentageBox}) => {

    return (
        <header className="Header">
            <div className="Header__container">
                <h1 className="Header__title">
                    Прогноз сбережений
                </h1>
                <div className="Header__container">
                    <input id="percentage_checkbox" type="checkbox" onChange={updatePercentageBox}/>
                    <p>
                        С вкладами
                    </p>
                </div>
            </div>
            <div className="Header__currency-choose">
                <p>Моя валюта</p>

                <select value={selectedCurrency.currency} onChange={(evt) => {
                    updateSelectedCurrency(evt.target.value);
                }}>
                    {data.map((el, i) => (
                        <option key={i} value={el.currency}>{el.symbol}</option>
                    ))
                    }
                </select>

            </div>
        </header>
    );

};
const enhancer = compose(connect(mapStateToProps, mapDispatchToProps));

const Header = enhancer(ConnectedHeader);


export default Header;
