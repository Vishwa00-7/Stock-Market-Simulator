

import React, { useEffect, useRef } from "react";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

//Global Variables
import { Global_Variables } from "../../App.jsx";

import { executeCurrentPrice, executeHistoricalPrices, executeCompanyMetadata } from "../../Pages/AboutStock.jsx";
import StockLineChart from "../Minor_Components/StockLineChart.jsx";
//Styles
import styles from "./StockInfo.module.css";

//Importing Components

function StockInfo(props) {


    //to get the symbol
    const location = useLocation();
    const navigate = useNavigate();

    const symbol = location.state || {};        //Stock Symbol
    const Stockname = useRef("");               //Stock Name
    const [StockQty,SetStockQty] = useState(0);                 //no of stocks you hold

    //Holds info about the Stocks
    const [currentPrice, setCurrentPrice] = useState({});       //Current Info
    //const [historicalPrice, setHistoricalPrice] = useState({}); //Historical Prices
    const [metaData, setMetaData] = useState({});               //Company Info

    let AccountID = useContext(Global_Variables);             //Account ID of User
    const accountData = useRef(undefined);                      //Account Data of user

    const [isOn, setIsOn] = useState(false); // to toggle watchlist button for rerendering

    const hasFetched = useRef(false);
    let tim = undefined;
    //using localstorage before backend
    //localStorage Structure
    //Watchlist   -> [StockSymbol , StockName]
    //portfolio   -> [id , symbol , stockname , price , date and time (in ms)]
    //transaction -> [id , symbol , stockname , Costprice , date and time @purchase, sellingprice , date and time @selling]

    useEffect(() => {
        
        // 3. Flip the lock immediately
        
        if (AccountID.current === null || AccountID.current === undefined){
            if (sessionStorage !== undefined)
                AccountID.current = sessionStorage.getItem("AccountID");
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        //console.log("from portfolio"  , AccountID);
        async function fetchData() {
            let cp = await executeCurrentPrice(symbol);
            //let hp = await executeHistoricalPrices(symbol);
            let md = await executeCompanyMetadata(symbol);
            setCurrentPrice(cp);
            setMetaData(md);

            if (cp.high == 0 && cp.low == 0 ){
                toast.warn("Stock Info not found");
                if (tim != undefined)
                    clearTimeout(tim);
                tim = setTimeout(() => navigate(-1) , 3000);
                
            }
            //setHistoricalPrice(hp);
            
            //console.log("API Data" , cp , md);
            Stockname.current = md.name;
        }
        fetchData();
        if (Storage !== undefined) {
            accountData.current = localStorage.getItem(AccountID.current);
            accountData.current = JSON.parse(accountData.current);
            //console.log(accountData.current);
            let portfolio = accountData.current.portfolio;
            //console.log(portfolio);
            let tmpqty = 0;
            for (let i=0 ; i < portfolio.length ; i++){
                if (portfolio[i][1] == symbol)
                    tmpqty += 1;
            }
            SetStockQty(tmpqty);
        }
    }, []);

    function back(e) {
        e.preventDefault();
        navigate(-1);
    }

    function inWatchlist() {
        if (accountData.current != undefined){
            let temp = accountData.current.watchlist;
            for (let i=0 ; i < temp.length ; i++){
                if (temp[i][0] == symbol)
                    return true;
            }
            return false;
        }
        return false;
    }

    function toggleToWatchlist() {
        console.log(inWatchlist());
        if (accountData.current != undefined) {
            if (inWatchlist()) {
                let temp = accountData.current.watchlist;
                let updated = temp.filter(item => item[0] !== symbol);
                accountData.current.watchlist = updated;
            }
            else {
                let temp = accountData.current.watchlist;
                temp.push([symbol, Stockname.current]);
                accountData.current.watchlist = temp;
            }
            setIsOn(prev => !prev);
            localStorage.setItem(AccountID.current, JSON.stringify(accountData.current));
        }
    }

    function changeStockQty(n = 1){
        SetStockQty(c => (c + n));
    }

    function buy(){
        if (accountData.current != undefined){
            if (accountData.current.amount >= currentPrice.currentPrice){
                accountData.current.amount -= currentPrice.currentPrice;
                let id = accountData.current.portfolio.length + 1;
                let dateAndTime = Date.now();
                let tempPortfolio = [id , symbol , Stockname.current , currentPrice.currentPrice , dateAndTime ];
                accountData.current.portfolio.push(tempPortfolio);
                changeStockQty();
                localStorage.setItem(AccountID.current, JSON.stringify(accountData.current));
                //display success pop up later
                toast.success("Purchased Successfully");
            }
            else
                toast.warn("Purchase failed. Insufficient funds");
                //console.log("not enough money")

            //display failed pop up
        }
    }

    function sell(){
          if (accountData.current != undefined){
            if (StockQty > 0){
                accountData.current.amount += currentPrice.currentPrice;
                let oldPortfolio = accountData.current.portfolio;
                let newPortfolio = [];
                let tempTransaction = null;
                for (let i=0 ; i < oldPortfolio.length ; i++){
                    if (oldPortfolio[i][1] == symbol && tempTransaction === null){
                        tempTransaction = oldPortfolio[i];
                    }
                    else{
                        newPortfolio.push(oldPortfolio[i]);
                    }
                }
                tempTransaction.push(currentPrice.currentPrice);        //push selling price
                tempTransaction.push(Date.now());

                accountData.current.transaction.push(tempTransaction);
                accountData.current.portfolio = newPortfolio;

                changeStockQty(-1);

                localStorage.setItem(AccountID.current, JSON.stringify(accountData.current));
                toast.success("Successfully sold",
                    {style :{backgroundColor: "red"}});
                //display success pop up later
            }
            else
                toast.warn("Transaction canceled. You do not own enough stock" );
                //console.log("not enough stock")
            //display failed pop up
        }
    }




    return (
        <div className={styles.stockinfo}>
            <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
            <div className={styles.top}>
                <button onClick={(e) => back(e)} className={styles.backbtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                </button>
                <h1 className={styles.symbol}>{symbol}</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.description}>
                    <h1 className={styles.descriptionHeading}> {metaData.name} </h1>
                    <p>{metaData.description}</p>
                </div>
                <div className={styles.graph}>
                    <StockLineChart symbol={symbol} />
                </div>
                <div className={styles.metaData}>
                    <div>
                        <span className={styles.mdkey}> Open : </span>
                        <span className={styles.mdvalue}> {currentPrice.open} </span>
                        <br />
                    </div>
                    <div>
                        <span className={styles.mdkey}> High : </span>
                        <span className={styles.mdvalue}> {currentPrice.high}</span>
                        <br />
                    </div>
                    <div>
                        <span className={styles.mdkey}> Low : </span>
                        <span className={styles.mdvalue}> {currentPrice.low} </span>
                        <br />
                    </div>
                    <div>
                        <span className={styles.mdkey}> Change : </span>
                        <span className={styles.mdvalue}> {currentPrice.change} </span>
                        <br />
                    </div>
                </div>
                <br />
            </div>
            <br/>
            <div></div>
            <div className={styles.mainInfo}>
                <h2 className={styles.priceinfo}>
                    {" $ "}
                    {currentPrice.currentPrice}
                    {"  "}
                    <span className={`${(currentPrice.changePct != undefined && currentPrice.changePct[0]) == "-" ? styles.negative : styles.positive}`}>{currentPrice.changePct}</span>
                    {"  "}
                    Qty : 
                    { StockQty }
                </h2>
                <div className={styles.mainbtn}>
                <button className={styles.purbtn + " " + styles.wacthlistbtn} onClick={toggleToWatchlist}>
                    <svg className={`${inWatchlist() ? styles.fillsvg : ""}`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#1f1f1f"><path d="M330.67-255.5 480-345l149.33 90.33L589.5-424l131.67-114-173.34-15.5-67.83-160-67.5 159.62L239.17-539l131.66 113.83-40.16 169.67ZM235.5-123.33l64.5-278.4L84-588.67l285.17-24.83L480-875.83 591.17-613.5 876-588.67 659.99-401.73l64.8 278.4-244.64-147.74L235.5-123.33ZM480-474Z"/></svg>
                    <svg className={`${inWatchlist() ? "" :styles.fillsvg }`} xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#1f1f1f"><path d="m235.5-123.33 64.5-278.4L84-588.67l285.17-24.83L480-875.83 591.17-613.5 876-588.67 659.99-401.73l64.8 278.4-244.64-147.74L235.5-123.33Z"/></svg>
                </button>
                <div className={styles.shopbtn}>
                <button className={styles.buybtn + " " + styles.purbtn} onClick={buy}> Buy </button>
                <button className={styles.sellbtn + " " + styles.purbtn} onClick={sell}> Sell </button>
                </div>
                </div>
            </div>
            <br/>
            <br/>
        </div>
    );
}

export default StockInfo;