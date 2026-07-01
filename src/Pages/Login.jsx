
import React, { useEffect } from "react";
import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Global_Variables } from "../App";

import styles from "./Login.module.css";
import BGImgPath from "../assets/Pages/stock_background.png";
import googleImg from "../assets/Pages/google-logo.png";


//using the style
//<button className={styles.greenButton}>Click Me</button>

function Login() {

    const AccountID = useContext(Global_Variables);
    //for Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //for Creation
    const [craeteUserName, createUser] = useState("");
    const [createPassword, createPass] = useState("");
    const navigate = useNavigate();

    let newData = {
        "name": "", "amount": 20000, "watchlist": [],
        "portfolio": [], "transaction": []
    };

    let AccountInfo = useRef([]);
    //using localstorage befor backend
    useEffect(() => {
        if (Storage !== undefined) {
            AccountInfo.current = localStorage.getItem("AccountInfo");
            AccountInfo.current = JSON.parse(AccountInfo.current);
            if (AccountInfo.current == undefined || AccountInfo.current == null) {
                AccountInfo.current = [];
            }
            //console.log(AccountInfo.current);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        //console.log(AccountInfo);
        for (let i = 0; i < AccountInfo.current.length; i++) {
            if (AccountInfo.current[i].name == username && AccountInfo.current[i].password == password) {
                console.log("login Successfully");
                AccountID.current = AccountInfo.current[i].accountId;
                if (sessionStorage !== undefined)
                    sessionStorage.setItem("AccountID", AccountID.current);
                //console.log(AccountID)
                setUsername("");
                setPassword("");
                navigate("/stockApp");
                break;
            }
            else
                console.log("Invalid Password");
        }
    };

    const handleSignin = () => {
        console.log(AccountInfo.current);
        let flag = 1;
        for (let i = 0; i < AccountInfo.current.length; i++) {
            if (AccountInfo.current[i].name == craeteUserName) {
                console.log("Already Present");
                flag = 0;
            }
        }
        if (flag == 1) {
            //console.log("updated");
            let id = AccountInfo.current.length + 1;
            AccountInfo.current.push({
                "name": craeteUserName,
                "password": createPassword,
                "accountId": ("StockId" + id)
            });
            localStorage.setItem("AccountInfo", JSON.stringify(AccountInfo.current));
            newData.name = craeteUserName;
            localStorage.setItem("StockId" + id, JSON.stringify(newData));
            createUser("");
            createPass("");
        }

        //setSigninInfo([craeteUserName , createPassword])
    }



    let [loginStyle, setloginStyle] = useState({ "display": "block" });
    let [signinStyle, setsigninStyle] = useState({ "display": "none" });


    const toggleForm = (cond) => {
        setUsername("");
        setPassword("");
        createUser("");
        createPass("");
        if (cond == "create") {
            setloginStyle({ "display": "none" });
            setsigninStyle({ "display": "block" });
        }
        else {
            setloginStyle({ "display": "block" });
            setsigninStyle({ "display": "none" });
        }
    }



    return (
        <div className={styles.Login}>
            <h1 className={styles.heading}>Stock Simulator</h1>
            <div className={styles.wrapper}>
                <div className={styles.backGround} >
                    <img src={BGImgPath} className={styles.backGroundImg} />
                </div>
            </div>
            <div className={styles.inputform}>
                <div className={styles.loginForm} style={loginStyle}>

                    <h1 className={styles.inputheading}>Welcome back! <br />
                        Login to your account</h1>
                    <input type="text" className={styles.logUser} placeholder="Enter your Name" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <input type="password" className={styles.logPassword} placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <button className={styles.loginBtn} onClick={(e) => handleLogin(e)}>Log in</button>
                    <a onClick={() => toggleForm("create")}>Don't have an account</a>
                </div>

                <div className={styles.createForm} style={signinStyle}>
                    <h1 className={styles.inputheading}>Join US! <br />
                        Create your account</h1>
                    <input type="text" className={styles.logUser} placeholder="Enter your Name" value={craeteUserName} onChange={(e) => createUser(e.target.value)} />
                    <br />
                    <input type="password" className={styles.logPassword} placeholder="Enter your Password" value={createPassword} onChange={(e) => createPass(e.target.value)} />
                    <br />
                    <button className={styles.loginBtn} onClick={handleSignin}>Create Account</button>
                    <a onClick={() => toggleForm("login")}>Alraedy have an account</a>
                </div>

                <br />
                <hr />
                <p>OR</p>
                <hr />
                <button className={styles.googleLogin} >
                    <img src={googleImg} className={styles.googleImg} />
                    Continue With Google
                </button>

            </div>

        </div>
    );
}

export default Login;
