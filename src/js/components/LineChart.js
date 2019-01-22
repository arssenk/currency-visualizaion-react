import React, {Component} from "react";
import "../styles/LineChart.css";
import * as d3 from "d3";
import {convertCurrency, convertToYYMMDDFormat} from "../helpers/utils";
import {compose} from "recompose";
import {connect} from "react-redux";
import {updatePredictionPoint} from "../actions/index";


class LineChart extends Component {
    componentDidMount() {
        this.renderLineChart()
    }

    componentDidUpdate(prevProps) {
        //TODO ckeck if ok to rerender this way
        if (prevProps.selectedCurrency !== this.props.selectedCurrency || prevProps.allowRendering !== this.props.allowRendering) {
            //TODO rerender the bar in different way

            //Clean content of svg
            d3.select(this.svgEl).selectAll("*").remove();
            this.renderLineChart()
        }

    }

    createDataForGraph(dataSource, supportedCurrencies,selectedCurrency, timeParser) {
        return supportedCurrencies.filter(item => {
            return item !== selectedCurrency
        }).map((currentCurrencyToAssign) => {
            return {
                currentCurrency: currentCurrencyToAssign,
                values: dataSource.map((d) => {
                    return {
                        date: timeParser(d.date),
                        currency: convertCurrency(1,
                            d[currentCurrencyToAssign], d[selectedCurrency]),
                        currencyName: currentCurrencyToAssign

                    };
                })
            };
        })
    }


    renderLineChart() {
        const COLORS_FOR_CURR = ["#0066cc", "#009933", "#ff9900", "#ff0000", "#b35900", "#862d59", "#F1EE19", "#D611CC"];

        let dataStatic = this.props.currencyHistory;
        let dataMoving = this.props.currencyPredictionPoints;
        let dataCombined = dataStatic.concat(dataMoving);

        let namesXAxis = ["год назад", "сегодня", "через год"];
        console.log("in line chart dataStatic", dataStatic , "dataMob", dataMoving)

        let svgLineChart = d3.select(this.svgEl),
            marginLineChart = {top: 5, right: 20, bottom: 60, left: 30},
            widthLineChart = this.props.width - marginLineChart.left - marginLineChart.right,
            heightLineChart = this.props.height - marginLineChart.top - marginLineChart.bottom,
            gLineChart = svgLineChart.append("g").attr("transform", "translate(" + marginLineChart.left + ","
                + marginLineChart.top + ")");

        let timeParser = d3.timeParse("%Y-%m-%d");

        let focusCurrencies = [];
        let drags = [];
        let draggedFunctions = [];
        let lineMovingItems = [];
        // let lineConcatenateItems = [];

        let x = d3.scaleTime().range([1, widthLineChart]);

        let xLabels = d3.scaleBand().domain(namesXAxis)
            .range([0, widthLineChart])
            .paddingInner(0.35);

        let y = d3.scaleLinear().range([heightLineChart, 0]);

        let colorsDomain = d3.scaleOrdinal(d3.schemeAccent);

        let line = d3.line()
            .x((d) => {
                return x(d.date);
            })
            .y((d) => {
                return y(d.currency);
            });

        let currencies = this.createDataForGraph(dataCombined, this.props.supportedCurrencies, this.props.selectedCurrency, timeParser);
        let currenciesStatic = this.createDataForGraph(dataStatic, this.props.supportedCurrencies, this.props.selectedCurrency, timeParser);
        let currenciesMoving = this.createDataForGraph(dataMoving, this.props.supportedCurrencies, this.props.selectedCurrency, timeParser);

        x.domain(d3.extent(dataCombined, function (d) {
            return timeParser(d.date);
        }));

        //MinMax
        y.domain([
            d3.min(currencies, (c) => {
                return d3.min(c.values, function (d) {
                    return d.currency - 0.1;
                });
            }),
            d3.max(currencies, (c) => {
                return d3.max(c.values, function (d) {
                    return d.currency + d.currency / 8;
                });
            })
        ]).nice();

        colorsDomain.domain(currencies.map(function (c) {
            return c.currentCurrency;
        }));


        // Create focus group items and drug functions for each currency
        this.props.supportedCurrencies.map((curr, i) => {
            focusCurrencies[i] = svgLineChart.append("g")
                .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");
            lineMovingItems[i] = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.currency);
                });

            draggedFunctions[i] = (d) => {
                if (d3.event.y < heightLineChart - 2 && d3.event.y > 2 && y.invert(d3.event.y) > 0) {
                    d.currency = y.invert(d3.event.y);

                    //Update circle coordinate
                    d3.select(".active")
                        .attr('cx', x(d.date))
                        .attr('cy', y(d.currency));

                    //Update path
                    focusCurrencies[i].select('path').attr('d', lineMovingItems[i]);
                    // console.log("in line calling update Prediciton", d.currencyName, d.currency, "currenct state", this.props.currencyPredictionPoints[1])

                    //Update storage
                    this.props.updatePredictionPoint(d.currencyName, d.currency,
                        convertToYYMMDDFormat(d.date.getFullYear(), d.date.getMonth() + 1, d.date.getDate()));

                }
            };
            drags[i] = d3.drag()
                .on('start', dragstarted)
                .on('drag', draggedFunctions[i])
                .on('end', dragended);

            return drags[i]
        });




        let currencyLines = gLineChart.selectAll(".currencyLines")
            .data(currenciesStatic)
            .enter().append("g")
            .attr("class", "currencyLines");

        currencyLines.append("path")
            .attr("class", "LineChart__path")
            .attr("d", function (d) {
                return line(d.values);
            })
            .style("stroke", (d) => {
                this.props.supportedCurrencies.filter(item => {
                    return item !== this.props.selectedCurrency
                });
                if (this.props.supportedCurrencies.includes(d.currentCurrency)) {
                    return COLORS_FOR_CURR[this.props.supportedCurrencies.indexOf(d.currentCurrency)]
                }
                else {
                    return colorsDomain(d.currentCurrency);
                }
            });


        // add line path to points add circles
        for (let i = 0; i < focusCurrencies.length - 1; i++) {

            focusCurrencies[i].append("path")
                .datum(currenciesMoving[i].values)
                .attr("class", "LineChart__moving-lines")
                .attr("fill", "none")
                .style("stroke", () => {
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

            //Add circles
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
                .style('fill', () => {
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
                    this.remove();
                    return true
                }
            })
                .call(drags[i]);
        }

        //Add bottom axis
        gLineChart.append("g")
            .attr("class", "LineChart__axis-bottom")
            .attr("transform", "translate(0," + (heightLineChart - 1) + ")")
            .call(d3.axisBottom(xLabels))
            .attr("font-size", "11px");

        //Add grid
        svgLineChart.append("g")
            .attr("class", "LineChart__grid")
            .attr("transform", "translate(" + marginLineChart.left + "," + (heightLineChart + marginLineChart.top ) + ")")
            .call(make_x_gridlines()
                .tickSize(-heightLineChart)
                .tickFormat("")
            );

        svgLineChart.append("g")
            .attr("class", "LineChart__grid")
            .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")")
            .call(make_y_gridlines()
                .tickSize(-widthLineChart)
            );

        //Remove zero tick
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


        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(4)
        }

        function make_x_gridlines() {
            return d3.axisBottom(xLabels.paddingInner(0).paddingOuter(0.4))
        }
    }


    render() {
        return <div className="LineChart">
            <p>История и прогноз курсов</p>
            <p>Перетащите точку, чтобы изменить прогноз</p>
            <svg
                 width={this.props.width}
                 height={this.props.height}
                 ref={el => this.svgEl = el}>

            </svg>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        currencyHistory: Object.values(state.currencyHistory),
        supportedCurrencies: Object.keys(state.data),
        selectedCurrency: state.selectedCurrency,
        currencyPredictionPoints: [Object.values(state.currencyHistory)[Object.values(state.currencyHistory).length - 1]]
            .concat(Object.values(state.currencyPredictionPoints)),
        allowRendering: state.allowRendering
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updatePredictionPoint: (curr, value, date) => dispatch(updatePredictionPoint(curr, value, date)),
    };
};

//TODO Review
const enhancer = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhancer(LineChart);


