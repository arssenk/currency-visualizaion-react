import React from "react";
import "../styles/App.css";
import ConvertTable from "./ConvertTable";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Header from "./Header";

const App = () => (

    <div>
        <Header />
        <ConvertTable />
        <LineChart />
        <BarChart />
    </div>

);
export default App;