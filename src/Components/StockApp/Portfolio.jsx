import React, { useRef } from "react";
import { useState, useContext , useEffect } from "react";
import { Global_Variables } from "../../App.jsx";
import SearchCard from "../Minor_Components/SearchCard.jsx";
import styles from "./Portfolio.module.css";

function Portfolio(props) {

    let AccountID = useContext(Global_Variables);
    
    const accountData = useRef(undefined);                      //Account Data of user
    const portfolioInfo = useRef([]);
    const totalInvestment = useRef(0);
    const [cardList , setCardList] = useState([]);

    useEffect(() => {
        if (AccountID.current === null || AccountID.current === undefined){
            if (sessionStorage !== undefined)
                AccountID.current = sessionStorage.getItem("AccountID");
        }
       
        if (Storage !== undefined) {
            accountData.current = localStorage.getItem(AccountID.current);
            accountData.current = JSON.parse(accountData.current);
            //console.log(accountData.current);
            portfolioInfo.current = accountData.current.portfolio;
            //console.log(portfolioInfo)
            for (let i=0 ; i < portfolioInfo.current.length ; i++){
                totalInvestment.current += portfolioInfo.current[i][3];
            }
            
            let rl = portfolioInfo.current.map((element , index) => {
                return (<SearchCard  info ={[ element[1] , element[2]]} 
                    addinfo = {[ element[3] , false ,"$"]}
                    pos = {index + 20} />)});
            setCardList(rl)

            
        }
    }, []);

return (
    <div className={styles.portfolio}>
        <h1 className={styles.heading}>portfolio</h1>
        <div className={styles.totalinvestment}>
            Total Investment : $ {totalInvestment.current.toFixed(2)}
        </div>
        <br/>
        <div className={styles.portfoliocontent}>
            {cardList}
            <br/>
            <br/>
        </div>
        <br/>
    </div>
);
}

export default Portfolio;