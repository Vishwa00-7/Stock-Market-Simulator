import React, { useRef } from "react";
import { useState, useContext , useEffect } from "react";
import { Global_Variables } from "../../App.jsx";
import SearchCard from "../Minor_Components/SearchCard.jsx";
import styles from "./TransactionComponent.module.css";

function TransactionComponent(props) {

    let AccountID = useContext(Global_Variables);
    const accountData = useRef(undefined);                      //Account Data of user
    const transactionInfo = useRef([]);
    const totalValue = useRef(0);
    const [cardList , setCardList] = useState([]);

    useEffect(() => {
        if (AccountID.current === null || AccountID.current === undefined){
            if (sessionStorage !== undefined)
                AccountID.current = sessionStorage.getItem("AccountID");
        }

        if (Storage !== undefined) {
            accountData.current = localStorage.getItem(AccountID.current);
            accountData.current = JSON.parse(accountData.current);
            console.log(accountData.current);
            transactionInfo.current = accountData.current.transaction;
            //console.log(transactionInfo , totalValue);
            totalValue.current = 0;
            let diff = 0
            for (let i=0 ; i < transactionInfo.current.length ; i++){
                diff = transactionInfo.current[i][5] - transactionInfo.current[i][3];
                totalValue.current += diff;
                //console.log(totalValue.current)
            }
            totalValue.current = totalValue.current.toFixed(2);
            let rl = transactionInfo.current.map((element , index) => {
                return (<SearchCard  info ={[ element[1] , element[2]]} 
                    addinfo = {[ (element[5] - element[3]).toFixed(2) , true , "$"]}
                    pos = {index + 30} />)});
            setCardList(rl);
        }
    }, []);

return (
    <div className={styles.transaction}>
        <h1 className={styles.heading}>Transaction</h1>
        <div className={styles.totalvalue}>
            Total Value : $ {totalValue.current}
        </div>
        <br/>
        <div className={styles.transactioncontent}>
            {cardList}
            <br/>
            <br/>
        </div>
        <br/>
    </div>
);
}

export default TransactionComponent;