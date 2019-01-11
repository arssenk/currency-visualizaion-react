import React from "react";
//TODO check if correctly imported
import "../styles/Header.scss";
import {updatePercentageBox, updateSelectedCurrency} from "../actions/index";
import {connect} from "react-redux";
import {compose} from "redux";


const mapStateToProps = state => {
    return {
        data: Object.values(state.data),
        selectedCurrency: state.selectedCurrency
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSelectedCurrency: (currencyName) => dispatch(updateSelectedCurrency(currencyName)),
        updatePercentageBox: (percentageBoxChecked) => dispatch(updatePercentageBox(percentageBoxChecked)),
    };
};

const ConnectedHeader = ({data, selectedCurrency, updateSelectedCurrency, updatePercentageBox}) => {

    return (
        <header className="converter-header">
            <div className="converter-header__container">
                <h1 className="converter-header__title">
                    Прогноз сбережений
                </h1>
                <div className="converter-header__container">
                    <input id="percentage_checkbox" type="checkbox" onChange={updatePercentageBox}/>
                    <p>
                        С вкладами
                    </p>
                </div>
            </div>
            <div className="converter-header__currency-choose">

                <select value={selectedCurrency.currency} onChange={(evt) => {
                    updateSelectedCurrency(evt.target.value)
                }}>
                    {data.map((el, i) => (
                        <option key={i} value={el.currency}>{el.symbol}</option>
                    ))
                    }
                </select>

                <p>Моя валюта</p>
            </div>
        </header>
    );

};
const enhancer = compose(connect(mapStateToProps, mapDispatchToProps));

const Header = enhancer(ConnectedHeader);


export default Header;
