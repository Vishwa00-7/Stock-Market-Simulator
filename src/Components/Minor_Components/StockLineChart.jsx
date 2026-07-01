import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { executeHistoricalPrices } from "../../Pages/AboutStock.jsx";
import styles from "./StockLineChart.module.css";

export default function StockLineChart(props) {

    const [chartData, setChartData] = useState([]);
    const [chartRange, setChartRange] = useState("Y");
    const lineColor = useRef("#2563eb");
    //profit -> #81c995
    //loss -> #f28b82

    useEffect(() => {

        // 3. Flip the lock immediately
        async function getDetails() {
            if (!props.symbol) return;

            let hd = await executeHistoricalPrices(props.symbol, chartRange);
            setChartData(hd);

            let list = sessionStorage.getItem("StockInfo");
            list = JSON.parse(list);
            if (list == undefined || list == null)
                list = [];

            //console.log(list);

            console.log("hp from api", chartData, hd);
            if (hd.length > 0)
                list.push([props.symbol, chartRange, hd]);
            sessionStorage.setItem("StockInfo", JSON.stringify(list));
        }
        let temp = null;
        let flag = true
        let chartList = sessionStorage.getItem("StockInfo");
        chartList = JSON.parse(chartList);
        //console.log(chartList)
        if (chartList !== undefined && chartList !== null) {
            for (let i = 0; i < chartList.length; i++) {
                temp = chartList[i];
                if (temp[0] == props.symbol && temp[1] == chartRange && temp[2].length != 0) {
                    setChartData(temp[2]);
                    flag = false;
                }
            }
        }
        if (flag == true) {
            getDetails();
        }
        //console.log(chartData);
    }, [props.symbol, chartRange]);

    function changeSplit(value) {
        setChartRange(value);
    }

    function setColor() {
        try {
            let start = chartData[0].close;
            let end = chartData[chartData.length - 1].close;
            let fl = end - start;
            if (fl >= 0)
                return "#81c995";
            else
                return "#f28b82";
        }
        catch (e) {
            return "#2563eb";
        }
    }

    //styling tooltip and line
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const val = payload[0].value;
            // We can conditionally style the tooltip text based on the value too!

            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltip_p} >{label}</p>
                    <p className={styles.tooltip_p}>
                        Value: {val}
                    </p>
                </div>
            );
        }
        return null;
    };



    return (
        <div className={styles.stocklinechart}>
            <div className={styles.linechart}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(tick) => tick.split('-').slice(1).join('/')} // Formats 2026-06-21 to 06/21
                        />

                        <YAxis domain={['auto', 'auto']} tickFormatter={(tick) => `$${tick}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="close"
                            stroke={setColor()}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.splitselector}>
                <button type="button" onClick={() => changeSplit("Y")} className={`${styles.splitbtn} ${chartRange === "Y" ? styles.active : ""}`}>1Y</button>
                <button type="button" onClick={() => changeSplit("M")} className={`${styles.splitbtn} ${chartRange === "M" ? styles.active : ""}`} >1M</button>
                <button type="button" onClick={() => changeSplit("W")} className={`${styles.splitbtn} ${chartRange === "W" ? styles.active : ""}`} >1W</button>
                <button type="button" onClick={() => changeSplit("D")} className={`${styles.splitbtn} ${chartRange === "D" ? styles.active : ""}`} >1D</button>
            </div>
        </div>
    );
}