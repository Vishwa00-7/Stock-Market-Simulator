import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { Global_Variables } from "../../App.jsx";
import styles from "./Profile.module.css";
import { useTheme } from '../../ThemeContext.jsx';
import Portfolio from "./Portfolio.jsx";

function Profile(props) {

    //const { ____ , ____ } = usseContext(Global_Variables);
    let AccountID = useContext(Global_Variables);

    const accountData = useRef(undefined);                      //Account Data of user
    const [userName, setUser] = useState("");
    const [currentBalance, setBalance] = useState(20000);
    const [portfolioValue , setPortfolioValue] = useState(0);
    const { theme, setTheme} = useTheme();

    const navigate = useNavigate();

    useEffect(() => {
        //console.log(AccountID)
        if (AccountID.current === null || AccountID.current === undefined || AccountID.current === "") {
            if (sessionStorage !== undefined)
                AccountID.current = sessionStorage.getItem("AccountID");
        }
        if (Storage !== undefined) {
            accountData.current = localStorage.getItem(AccountID.current);
            accountData.current = JSON.parse(accountData.current);
        }
        setUser(accountData.current.name);
        setBalance(accountData.current.amount)
        let sum =0;
        for (let i=0; i< accountData.current.portfolio.length ; i++){
            sum += (accountData.current.portfolio[i][3] - 0);
            //console.log(sum);
        }
        //console.log(sum);
        setPortfolioValue(sum);
    }, []);

    function setColor() {
        
        if (theme == "light" )
            return "white"
        if ((currentBalance - 20000 + portfolioValue) >= 0)
            return "green";
        else
            return "red";
    }

    const handleChange = (e) => {
        setTheme(e.target.value);
    }
    
    function logOut(){
        sessionStorage.setItem("AccountID" , "");
        sessionStorage.setItem("Navpos" , "portfolio");
        sessionStorage.setItem("StockInfo" , JSON.stringify([]));
        AccountID.current = null;
        navigate("/")

    }


    return (
        <div className={styles.profile}>
            <h1 className={styles.heading}>Profile</h1>
            <div className={styles.userinfo}>
                <h1 className={styles.detail}> Hi , {userName} </h1>
                <h2 className={styles.detail}> Balance : {currentBalance.toFixed(2)} </h2>
                <h2 className={styles.detail + " " + styles.inline}>
                    Earned :
                </h2>
                <h2 className={styles.detail + " " + styles.inline} style={{ color: setColor(), marginLeft: "10px" }}>
                    {" " + (currentBalance - 20000 + portfolioValue).toFixed(2)}
                </h2>
            </div>
            <br />
            <div className={styles.settings}>
                <h1>Settings</h1>
                <div className={styles.option}>
                    <h2 className={styles.inline}> Appearance  :  </h2>
                    <select id="Appearance" value={theme} onChange={handleChange} className={styles.dropdown} >
                        <option value="system">System (Default)</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className={styles.option} onClick={logOut}>
                    <svg className={styles.logoutsvg} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ef4444"><path d="M189.06-113.3q-31 0-53.38-22.38-22.38-22.38-22.38-53.38v-581.88q0-31.06 22.38-53.49 22.38-22.43 53.38-22.43h291.87v75.92H189.06v581.88h291.87v75.76H189.06ZM654.7-287.1l-53.45-54.14 100.72-100.88H358.41v-75.76h342.23L599.91-618.76l53.46-54.14 193.49 193.57L654.7-287.1Z"/></svg>
                   <h2 className={styles.logout}> Log Out </h2>
                </div>

            </div>

        </div>
    );
}

export default Profile;