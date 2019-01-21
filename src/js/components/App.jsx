import React from "react";
import "../styles/App.css";
import ConvertTable from "./ConvertTable";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Header from "./Header";


const App = () => (
//TODO load history at beginning

    <div className="App">
        <Header />
        <div className="App__container">
            <ConvertTable />
            <LineChart width={270} height={236}/>
            <BarChart width={307} height={226}/>
        </div>
    </div>

);
export default App;