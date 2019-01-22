import React from "react";
import {connect} from "react-redux";
import {addNewCurrency, updateModalShow} from "../actions/index";
import {compose} from "recompose";

import "../styles/Modal.css";

const Modal = ({updateModalShow, showModal, hiddenCurrencies, addNewCurrency}) => {
    const showHideClassName = showModal ? "Modal__display-block" : "Modal__display-none";
    console.log("showw", hiddenCurrencies)
    return (
        <div className={showHideClassName}>
            <section className="Modal__main">
                {hiddenCurrencies.map( (currencyName, i)=>{
                    return <button key={i} onClick={evt => addNewCurrency(currencyName)}>{currencyName}</button>

                })}
                <button onClick={updateModalShow}>close</button>
            </section>
        </div>
    );
};
const mapStateToProps = state => {
    return {
        showModal: state.showModal,
        hiddenCurrencies:state.hiddenCurrencies
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateModalShow: () => dispatch(updateModalShow()),
        addNewCurrency: (currencyName) => dispatch(addNewCurrency(currencyName))
    };
};

const enhancer = compose(connect(mapStateToProps, mapDispatchToProps));
export default enhancer(Modal);