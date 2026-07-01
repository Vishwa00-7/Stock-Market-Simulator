
import React, { useEffect } from "react";
import { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
//import { Global_Variables } from "./App.jsx";
import styles from "./Navbar.module.css";

//Images
import Movers from "../../assets/Components/Navbar/Movers.svg";
import Portfolio from "../../assets/Components/Navbar/Portfolio.svg";
import Profile from "../../assets/Components/Navbar/Profile.svg";
import Transaction_Icon from "../../assets/Components/Navbar/Transaction.svg";
import Watchlist from "../../assets/Components/Navbar/Watchlist.svg";


function Navbar(props){

    const navigate = useNavigate();
    const [ currentNavMenu , changeNavMenu] = useState("")
    //const { ____ , ____ } = usseContext(Global_Variables);
    function handleNavigate(pos){
        navigate(`/stockApp/${pos}`);
        changeNavMenu(pos);
        sessionStorage.setItem("Navpos" , pos);
    }

    useEffect(()=>{
        changeNavMenu("portfolio");
        let navStored = sessionStorage.getItem("Navpos");
        if (navStored != undefined)
        changeNavMenu(navStored);

    })

    function isCurrent(pos){
        return (pos == currentNavMenu)
    }
    
    return (
        <div className={styles.Navbar}>
            <button type="button" onClick={() => handleNavigate("watchlist")}>
                 <img src={Watchlist} className={`${isCurrent("watchlist") ? styles.selected : ""}`}/>
            </button>
            <button type="button" onClick={() => handleNavigate("movers")}> 
                <img src={Movers} className={`${isCurrent("movers") ? styles.selected : ""}`}/>
            </button>
            <button type="button" onClick={() => handleNavigate("portfolio")}> 
                <img src={Portfolio} className={`${isCurrent("portfolio") ? styles.selected : ""}`}/>
            </button>
            <button type="button" onClick={() => handleNavigate("transaction")}>
                <img src={Transaction_Icon} className={`${isCurrent("transaction") ? styles.selected : ""}`}/>
            </button>
            <button type="button" onClick={() => handleNavigate("profile")}> 
                <img src={Profile} className={`${isCurrent("profile") ? styles.selected : ""}`}/>
            </button>
        </div>
    );
}

export default Navbar;