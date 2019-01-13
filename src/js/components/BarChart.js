import React, {Component} from "react";
import "../styles/BarChart.css";
import {compose, mapProps} from "recompose";
import {connect} from "react-redux";
import * as d3 from "d3";
import {convertCurrency} from "../helpers/utils";

class BarChart extends Component {

    componentDidMount() {
        this.renderBarChart()
    }

    renderBarChart() {

        //TODO remove valieable and move to mapProps the slice
        let dataFourMonth = this.props.currencyPredictionPoints.slice(1, this.props.currencyPredictionPoints.length);

        let namesXAxisBar = ["сегодня", "через год"];
        //TODO rerender the bar in different way
        d3.select(".BarChart__svg").remove();

        d3.select(".BarChart").append("svg").attr("class", "BarChart__svg")
            .attr("width", 300).attr("height", 225);
        //
        let barChart = d3.select(".BarChart__svg"),
            marginBar = {top: 21, right: 21, bottom: 25, left: 53},
            widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
            heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
            gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

        let xBar = d3.scaleBand()
            .rangeRound([0, widthBar])
            .paddingInner(0.02);

        let xLabelsBarChart = d3.scaleOrdinal().domain(namesXAxisBar)
            .range([widthBar / 8 - 2, 7 * widthBar / 8 - 2]);

        let yBar = d3.scaleLinear()
            .rangeRound([heightBar, 0]);

        console.log(dataFourMonth)
        //TODO check if correct schemeAccent
        let colors = d3.scaleOrdinal(d3.schemeAccent);

        let keys = [];
        //
        //     if (document.getElementById("percentage_checkbox").checked) {
        //
        //         //Create "EUR", "EUR_percentage", ... keys
        //         for (let i = 0; i < SUPPORTED_CURRENCIES.length; i++) {
        //             keys.push(SUPPORTED_CURRENCIES[i]);
        //             keys.push(SUPPORTED_CURRENCIES[i] + "_percentage")
        //         }
        //     }
        //     else {
        keys = this.props.supportedCurrencies;
        //     }
        xBar.domain(dataFourMonth.map((d) => {
            return d.date;
        }));
        yBar.domain([0, d3.max(dataFourMonth, (d) => {
            return d.total * 1.5;
        })]);
        //
        colors.domain(keys);
        //
        const COLORS_FOR_CURR = ["#0066cc", "#009933", "#ff9900", "#ff0000", "#b35900", "#862d59", "#F1EE19", "#D611CC"];
        const colorsForPercentage = ["#66a3e0", "#66c285", "#ffb84d", "#ff4d4d", "#ff9933", "#d98cb3", "#FEFA01", "#FE01F0"];

        gBar.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(dataFourMonth))
            .enter().append("g")
            .attr("fill", (d) => {
                if (this.props.supportedCurrencies.includes(d.key)) {
                    return COLORS_FOR_CURR[this.props.supportedCurrencies.indexOf(d.key)]
                }
                else if (d.key.split("_").length > 1 && d.key.split("_")[1] === "percentage") {
                    return colorsForPercentage[this.props.supportedCurrencies.indexOf(d.key.split("_")[0])]
                }
                else {
                    return colors(d.key);
                }
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xBar(d.data.date)
            })
            .attr("y", function (d) {
                return yBar(d[1]);
            })
            .attr("height", function (d) {
                return yBar(d[0]) - yBar(d[1]);
            })
            .attr("width", xBar.bandwidth());

        gBar.append("g")
            .attr("class", "bar-chart__axis-bottom")
            .attr("transform", "translate(0," + heightBar + ")")
            .call(d3.axisBottom(xLabelsBarChart))
            .attr("font-size", "12px");

        let SUPPORTED_CURRENCIES_TXT = ["₽", "$", "€", "¥"];
        gBar.append("g")
            .attr("class", "bar-chart__axis-left")
            .call(d3.axisLeft(yBar).ticks(4)
                .tickFormat((d) => {
                    let tickValue = d3.format(".2s")(d);
                    // TOdo next sibling?
                    // if (this.parentNode.nextSibling) {
                    if (true) {
                        return tickValue
                    }
                    else {
                        return tickValue + " " + SUPPORTED_CURRENCIES_TXT[this.props.supportedCurrencies.indexOf(this.props.selectedCurrency)]
                    }
                }));

        //     updateTotalValuesGraph2(Math.round(dataFourMonth[0]["total"]),
        //         Math.round(dataFourMonth[dataFourMonth.length - 1]["total"])
        //     );

        //Remove zero tick
        barChart.selectAll(".tick")
            .filter(function (d) {
                return d === 0;
            })
            .remove();
    }

    render() {
        return <div className="BarChart"></div>
    }

}

const mapStateToProps = state => {
    return {
        data: state.data,
        todayCurrencies: state.currencyHistory[state.currencyHistory.length - 1],
        supportedCurrencies: Object.keys(state.data),
        selectedCurrency: state.selectedCurrency,
        currencyPredictionPoints: state.currencyPredictionPoints

    };
};

//TODO need to pass every prop
const convertValues = mapProps(({data, todayCurrencies, supportedCurrencies, selectedCurrency, currencyPredictionPoints}) => ({
    currencyPredictionPoints: currencyPredictionPoints.map((point) => ({
        ...Object.assign({}, ...Object.keys(point).map((key) => {
            return supportedCurrencies.includes(key) ? {[key]:
                convertCurrency(data[key].savings, point[key], point[selectedCurrency])} : {}
        }
        )),
        date:point.date
    })),
    todayCurrencies, supportedCurrencies, selectedCurrency
}));

//TODO check if can be merged into one function
const addTotalValues = mapProps(({data, todayCurrencies, supportedCurrencies, selectedCurrency, currencyPredictionPoints}) => ({
    currencyPredictionPoints: currencyPredictionPoints.map((point) => ({
        ...point,
        total: Object.values(point).reduce((a, b) => {
            if (typeof b !== "string") {
                return a + b
            }
            return a
        })

    })),
    todayCurrencies, supportedCurrencies, selectedCurrency
}));

const enhancer = compose(connect(mapStateToProps), convertValues, addTotalValues);
export default enhancer(BarChart);

//
// function updateTotalValuesGraph2(val1, val2) {
//
//     document.getElementById("graph-2-total-" + 1).value =
//         val1 + " " + SUPPORTED_CURRENCIES_TXT[SUPPORTED_CURRENCIES.indexOf(getChosenCurrency())];
//
//     document.getElementById("graph-2-total-" + 2).value =
//         val2 + " " + SUPPORTED_CURRENCIES_TXT[SUPPORTED_CURRENCIES.indexOf(getChosenCurrency())];
//
// }

function createDeepCopy(o) {
    let r = [];
    for (let i = 0; i < o.length; i++) {
        r.push(Object.assign({}, o[i]))
    }
    return Object.values(r)
}