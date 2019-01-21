import React, {Component} from "react";
import "../styles/BarChart.css";
import {compose, mapProps} from "recompose";
import {connect} from "react-redux";
import * as d3 from "d3";
import {select} from "d3-selection";
import {convertCurrency, formatCurrenciesForBarChart, formatTotalValue} from "../helpers/utils";
import {getData} from "../actions/index";

class BarChart extends Component {

    componentDidMount() {
        // this.props.getData(this.props.supportedCurrenciesAll, this.props.selectedCurrency);
        this.renderBarChart()

    }

    getProperData() {
        let marginBar = {top: 21, right: 21, bottom: 25, left: 53},
            widthBar = this.props.width - marginBar.left - marginBar.right,
            heightBar = this.props.height - marginBar.top - marginBar.bottom;

        let xBar = d3.scaleBand()
            .rangeRound([0, widthBar])
            .paddingInner(0.02);

        let xLabelsBarChart = d3.scaleOrdinal().domain(this.props.xAxisLabels)
            .range([widthBar / 8 - 2, 7 * widthBar / 8 - 2]);

        let yBar = d3.scaleLinear()
            .rangeRound([heightBar, 0]);

        //TODO check if correct schemePaired
        let colors = d3.scaleOrdinal(d3.schemePaired);

        colors.domain(this.props.supportedCurrencies);

        xBar.domain(this.props.currencyPredictionPoints.map((d) => {
            return d.date;
        }));

        yBar.domain([0, d3.max(this.props.currencyPredictionPoints, (d) => {
            return d.total * 1.5;
        })]);

        return {marginBar, xBar, xLabelsBarChart, yBar, colors, heightBar}
    }

    getTickValue(d, i, maxTicks){
        if (i === 0) {
            return " "
        }
        else if (i === maxTicks - 1) {
            return d3.format(".2s")(d) + " " + this.props.selectedCurrencyTxt
        }
        return d3.format(".2s")(d)
    }
    // getColorForLayer(stackLayer, layerIndex){
    //     if (this.props.supportedCurrencies.includes(d.key)) {
    //         return COLORS_FOR_CURR[this.props.supportedCurrencies.indexOf(d.key)]
    //     }
    //     else if (d.key.split("_").length > 1 && d.key.split("_")[1] === "percentage") {
    //         return colorsForPercentage[this.props.supportedCurrencies.indexOf(d.key.split("_")[0])]
    //     }
    //     else {
    //         return colors(d.key);
    //     }
    //     return this.props.colors[layerIndex]
    // }

    renderBarChart() {

        //TODO remove valieable and move to mapProps the slice
        let dataFourMonth = this.props.currencyPredictionPoints;
        console.log("in bar", dataFourMonth);
    }

    render() {
        let {marginBar, xBar, xLabelsBarChart, yBar, colors, heightBar} = this.getProperData()

        return <div >
            <svg className="BarChart" width={this.props.width}
                 height={this.props.height}>
                <g transform={`translate(${marginBar.left}, ${marginBar.top})`}>

                    {d3.stack().keys(this.props.supportedCurrencies)(this.props.currencyPredictionPoints).map((stackLayer, layerIndex) => (
                        <g fill={colors(stackLayer.key)} key={layerIndex}>
                            {stackLayer.map((el, el_index) => (
                                <rect key={el_index} x={xBar(el.data.date)} y={yBar(el[1])} height={yBar(el[0]) - yBar(el[1])}
                                      width={xBar.bandwidth()}> </rect>
                            ))}
                        </g>
                    ))}

                    <g
                        className="BarChart__axis-bottom"
                        transform={`translate(0, ${heightBar})`}
                        ref={node => select(node).call(d3.axisBottom(xLabelsBarChart))}
                    />
                    <g
                        className="BarChart__axis-left"
                        ref={node => select(node).call(d3.axisLeft(yBar).ticks(4).tickFormat((d, i) => this.getTickValue(d,i, yBar.ticks(4).length)))}
                    />
                </g>
            </svg>
            <div className="BarChart__total-container">

                <output>{this.props.totalAtStart}</output>
                <output>{this.props.totalAtEnd}</output>
            </div>
        </div>
    }

}

const mapStateToProps = state => {
    return {
        data: state.data,
        todayCurrencies: state.currencyHistory[state.currencyHistory.length - 1],
        supportedCurrencies: Object.keys(state.data),
        selectedCurrency: state.selectedCurrency,
        currencyPredictionPoints: state.currencyPredictionPoints,
        selectedCurrencyTxt: state.supportedCurrenciesTxt[state.supportedCurrenciesAll.indexOf(state.selectedCurrency)],
        colorsForCurrency: state.colorsForCurrency,
        colorsForPercentageCurrency: state.colorsForPercentageCurrency
    };
};

//TODO need to pass every prop
const convertValues = mapProps((props) => ({
    ...props,
    currencyPredictionPoints: formatCurrenciesForBarChart(props.data, props.currencyPredictionPoints, props.supportedCurrencies,
        props.selectedCurrency, convertCurrency)

}));

//TODO check if can be merged into one function
const addTotalValues = mapProps((props) => ({
    ...props,
    currencyPredictionPoints: props.currencyPredictionPoints.map((point) => ({
        ...point,
        total: Object.values(point).reduce((a, b) => {
            if (typeof b !== "string") {
                return a + b
            }
            return a
        })
    }))
}));//TODO check if can be merged into one function
const addXAxisLabels = mapProps((props) => ({
    ...props,
    xAxisLabels: ["сегодня", "через год"]
}));

//TODO check if can be merged into one function
const addSumValues = mapProps((props) => ({
    ...props,
    totalAtStart: formatTotalValue(props.currencyPredictionPoints[0]["total"], props.selectedCurrencyTxt
    ),
    totalAtEnd: formatTotalValue(props.currencyPredictionPoints[props.currencyPredictionPoints.length - 1]["total"], props.selectedCurrencyTxt),
}));

const enhancer = compose(connect(mapStateToProps, {getData}), convertValues, addTotalValues, addSumValues, addXAxisLabels);
export default enhancer(BarChart);


