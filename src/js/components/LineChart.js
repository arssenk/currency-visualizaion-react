import React, {Component} from "react";
import "../styles/LineChart.css";
import * as d3 from "d3";
import {convertCurrency, isCurrentYear} from "../helpers/utils";
import {compose} from "redux";
import {connect} from "react-redux";
import {DATA_MOVING} from "../constants/currencyHistory";


class LineChart extends Component {
    componentDidMount() {
        this.renderLineChart()
    }

    renderLineChart() {
        const COLORS_FOR_CURR = ["#0066cc", "#009933", "#ff9900", "#ff0000", "#b35900", "#862d59", "#F1EE19", "#D611CC"];

        let data = Object.values(Object.assign({}, this.props.currencyHistory));
        let dataToSplit = Object.values(Object.assign({}, data));

        let dataStatic = [];
        // let dataMoving = [this.props.todayCurrencies];
        let dataMoving = DATA_MOVING;
        let namesXAxis = ["год назад", "сегодня", "через год"];


        for (let i = 0; i < dataToSplit.length; i++) {

            if (isCurrentYear(dataToSplit[i].date, this.props.todayCurrencies.date)) {
                dataStatic.push(dataToSplit[i]);
            }
            else {
                dataMoving.push(dataToSplit[i])
            }
        }

        //Removing old graph
        d3.select(".LineChart__svg").remove();

        //Appending new graph
        d3.select(".LineChart").append("svg").attr("class", "LineChart__svg").attr("width", 270)
            .attr("height", 236);

        let svgLineChart = d3.select(".LineChart__svg"),
            marginLineChart = {top: 5, right: 20, bottom: 60, left: 30},
            widthLineChart = svgLineChart.attr("width") - marginLineChart.left - marginLineChart.right,
            heightLineChart = svgLineChart.attr("height") - marginLineChart.top - marginLineChart.bottom,
            gLineChart = svgLineChart.append("g").attr("transform", "translate(" + marginLineChart.left + ","
                + marginLineChart.top + ")");


        let x = d3.scaleTime().range([1, widthLineChart]);

        let xLabels = d3.scaleBand().domain(namesXAxis)
            .range([0, widthLineChart])
            .paddingInner(0.35);

        let y = d3.scaleLinear().range([heightLineChart, 0]);

        let colorsLineChart = d3.scaleOrdinal(d3.schemeAccent);
        // let colorsLineChart = d3.scaleOrdinal(d3.schemeCategory20);

        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(4)
        }

        function make_x_gridlines() {
            return d3.axisBottom(xLabels.paddingInner(0).paddingOuter(0.4))
        }

        let timeParser = d3.timeParse("%Y-%m-%d");

        let focusCurrencies = [];
        let drags = [];
        let draggedFunctions = [];
        let lineMovingItems = [];
        let lineConcatenateItems = [];
        //
        //
        let line = d3.line()
            .x( (d) => {
                return x(d.date);
            })
            .y( (d)=> {
                return y(d.currency);
            });
        //
        let currencies = this.props.supportedCurrencies.filter(item => {
            return item !== this.props.selectedCurrency
        }).map((currentCurrencyToAssign) => {

            return {
                currentCurrency: currentCurrencyToAssign,
                values: data.map((d) => {
                    return {
                        date: timeParser(d.date),
                        currency: convertCurrency(1,
                            d[currentCurrencyToAssign],  d[this.props.selectedCurrency])
                    };
                })
            };
        });

        let currenciesStatic = this.props.supportedCurrencies.filter(item => {
            return item !== this.props.selectedCurrency
        }).map((currentCurrencyToAssign) => {
            return {
                currentCurrency: currentCurrencyToAssign,
                values: dataStatic.map((d) => {
                    return {
                        date: timeParser(d.date),
                        currency: convertCurrency(1,
                            d[currentCurrencyToAssign], d[this.props.selectedCurrency])
                    };
                })
            };
        });

        let currenciesMoving = this.props.supportedCurrencies.filter(item => {
            return item !== this.props.selectedCurrency
        }).map( (currentCurrencyToAssign) => {
            return {
                currentCurrency: currentCurrencyToAssign,
                values: dataMoving.map( (d) => {
                    return {
                        date: timeParser(d.date),
                        currency: convertCurrency(1,
                            d[currentCurrencyToAssign], d[this.props.selectedCurrency]),
                        currencyName: currentCurrencyToAssign
                    };
                })
            };
        });

        x.domain(d3.extent(data, function (d) {
            return timeParser(d.date);
        }));

        //MinMax
        y.domain([
            d3.min(currencies, (c) =>  {
                return d3.min(c.values, function (d) {
                    return d.currency - 0.1;
                });
            }),
            d3.max(currencies,  (c) => {
                return d3.max(c.values, function (d) {
                    return d.currency + d.currency / 8;
                });
            })
        ]).nice();

        // Create focus group items and drug functions for each currency
        for (let i = 0; i < this.props.supportedCurrencies.length; i++) {

            focusCurrencies[i] = svgLineChart.append("g")
                .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");
            lineMovingItems[i] = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.currency);
                });

            lineConcatenateItems[i] = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.currency);
                });

            draggedFunctions[i] = function (d) {
                if (d3.event.y < heightLineChart - 2 && d3.event.y > 2 && y.invert(d3.event.y) > 0) {
                    console.log("111")

                    d.currency = y.invert(d3.event.y);
                    d3.select(this)
                        .attr('cx', x(d.date))
                        .attr('cy', y(d.currency));
                    focusCurrencies[i].select('path').attr('d', lineMovingItems[i]);

                    //____________________________________
                    // updateCurrency(d);
                    // renderBarChart(window.currencyHistory);



                    // renderLineChart();

                }
            }
            ;
            drags[i] = d3.drag()
                .on('start', dragstarted)
                .on('drag', draggedFunctions[i])
                .on('end', dragended);


        }


        colorsLineChart.domain(currencies.map(function (c) {
            return c.currentCurrency;
        }));
        //
        gLineChart.append("g")
            .attr("class", "line-chart__axis-bottom")
            .attr("transform", "translate(0," + (heightLineChart - 1) + ")")
            .call(d3.axisBottom(xLabels))
            .attr("font-size", "11px");


        let currencyLines = gLineChart.selectAll(".currencyLines")
            .data(currenciesStatic)
            .enter().append("g")
            .attr("class", "currencyLines");
        //

        currencyLines.append("path")
            .attr("class", "line-chart__path")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke",  (d) =>{
                this.props.supportedCurrencies.filter(item => {
                    return item !== this.props.selectedCurrency
                });
                if (this.props.supportedCurrencies.includes(d.currentCurrency)) {
                    return COLORS_FOR_CURR[this.props.supportedCurrencies.indexOf(d.currentCurrency)]
                }
                else {
                    return colorsLineChart(d.currentCurrency);
                }
            });


        // add line path to points add circles
        for (let i = 0; i < focusCurrencies.length - 1; i++) {

            focusCurrencies[i].append("path")
                .datum(currenciesMoving[i].values)
                .attr("class", "line-chart__moving-lines")
                .attr("fill", "none")
                .style("stroke",  () => {
                    if (this.props.supportedCurrencies.indexOf(this.props.selectedCurrency) <= i) {
                        return COLORS_FOR_CURR[i + 1]
                    }
                    else {
                        return COLORS_FOR_CURR[i]
                    }
                })
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2)
                .attr("d", lineMovingItems[i]);

            focusCurrencies[i].selectAll('circle')
                .data(currenciesMoving[i].values)
                .enter()
                .append('circle')
                .attr('r', 3.5)
                .attr('cx', function (d) {
                    return x(d.date);
                })
                .attr('cy', function (d) {
                    return y(d.currency);
                })
                .style('cursor', 'ns-resize')
                .style('fill',  () => {
                    if (this.props.supportedCurrencies.indexOf(this.props.selectedCurrency) <= i) {
                        return COLORS_FOR_CURR[i + 1]
                    }
                    else {
                        return COLORS_FOR_CURR[i]
                    }
                });

            //Filter first circle so it doesn't drag and doesn't show up
            focusCurrencies[i].selectAll('circle').filter(function (item, ind) {
                if (ind !== 0) {
                    return this
                }
                else {
                    this.remove()
                }
            })
                .call(drags[i]);
        }


        //Add grid
        svgLineChart.append("g")
            .attr("class", "line-chart__grid")
            .attr("transform", "translate(" + marginLineChart.left + "," + (heightLineChart + marginLineChart.top ) + ")")
            .call(make_x_gridlines()
                .tickSize(-heightLineChart)
                .tickFormat("")
            );
        //
        svgLineChart.append("g")
            .attr("class", "line-chart__grid")
            .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")")
            .call(make_y_gridlines()
                .tickSize(-widthLineChart)
            );

        // //Remove zero tick
        svgLineChart.selectAll(".tick")
            .filter(function (d) {
                return d === 0;
            })
            .remove();

        function dragstarted(d) {
            d3.select(this).raise().classed('active', true);
        }

        function dragended(d) {
            d3.select(this).classed('active', false);
        }

        // function updateCurrency(currencyItem) {
        //     for (let i = 0; i < window.currencyHistory.length; i++) {
        //         if (JSON.stringify(timeParser(window.currencyHistory[i].date)) === JSON.stringify(currencyItem.date)) {
        //             window.currencyHistory[i][currencyItem.currencyName] = 1 / currencyItem.currency;
        //         }
        //     }
        //     return 1;
        // }
    }


    render() {
        return <div className="LineChart"></div>
    }
}

const mapStateToProps = state => {
    return {
        currencyHistory: state.currencyHistory,
        todayCurrencies: state.currencyHistory[state.currencyHistory.length - 1],
        supportedCurrencies: Object.keys(state.data),
        selectedCurrency: state.selectedCurrency

    };
};

const enhancer = compose(connect(mapStateToProps));

export default enhancer(LineChart);


