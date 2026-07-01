
import React, { use, useEffect } from "react";
import { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
//Global Variables
//import { Global_Variables } from "./App.jsx";

//Styles
import styles from "./SearchCard.module.css";

//Importing Components

function SearchCard(props){

    const [symbol = "", name = ""] = Array.isArray(props?.info) ? props.info : [];
    let [price, flag , adder] = Array.isArray(props?.addinfo) ? props.addinfo : [null, false];

    const  [ print ,setPrint ] = useState(price);

    useEffect( ()=> {
        if (adder == "%")
            setPrint( price + " %")
        else if (adder == "$")
            setPrint("$ " + price);
    } , [])

    //price -> if (flag = false) : cost price  / else (flag = true) : (profit or loss) 

    if (price == null || price == undefined)
        price = "";
    if (flag == null || flag == undefined)
        flag = false;

    function setPriceColor(){
        if (flag == false)
            return "";
        else if (price >= 0)
            return "var(--profit)";
        else    
            return "var(--loss)";
    }

    const navigate = useNavigate();

    function goToStockInfo(e , symbol){
        e.preventDefault();
        navigate("/stockApp/stockInfo" , {state : symbol});
    }

    return (
        <div className={styles.searchcard} key={props.pos} onClick={(e) => goToStockInfo(e , symbol)}>
            <h2 className={styles.heading}>{symbol}</h2>
            
            <h2 className={styles.price} style={{color : setPriceColor()}}>
                {print}
            </h2>
            <br/>
            <p className={styles.name}>{name}</p>
        </div>
    );
}

export default SearchCard;