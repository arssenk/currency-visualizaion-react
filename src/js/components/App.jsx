import React from "react";
import "../styles/App.css";
import ConvertTable from "./ConvertTable";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Header from "./Header";

const App = () => (

    <div>
        <Header />
        <div className="App">
            <ConvertTable />
            <LineChart/>
            <BarChart/>
        </div>
    </div>

);
export default App;