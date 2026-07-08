
import React, { useEffect } from "react";
import { useState, useContext, useRef } from "react";
import { generatePath, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import { Global_Variables } from "../App";
import { addUser, loginByInput, validateToken } from "../FetchBackend.jsx";

import styles from "./Login.module.css";
import BGImgPath from "../assets/Pages/stock_background.png";
import googleImg from "../assets/Pages/google-logo.png";


//using the style
//<button className={styles.greenButton}>Click Me</button>

function Login() {
    const [searchParams] = useSearchParams();
    const AccountID = useContext(Global_Variables);
    //for Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //for Creation
    const [craeteUserName, createUser] = useState("");
    const [createPassword, createPass] = useState("");
    const navigate = useNavigate();
    const firstLoad = useRef(true)

    let newData = {
        "name": "", "amount": 20000, "watchlist": [],
        "portfolio": [], "transaction": []
    };

    let AccountInfo = useRef([]);

    useEffect(() => {
        //backend

        //using localstorage before backend
        /*
        if (Storage !== undefined) {
            AccountInfo.current = localStorage.getItem("AccountInfo");
            AccountInfo.current = JSON.parse(AccountInfo.current);
            if (AccountInfo.current == undefined || AccountInfo.current == null) {
                AccountInfo.current = [];
            }
            //console.log(AccountInfo.current);
        }*/
        async function afun() {
            const storedAccountId = sessionStorage.getItem("AccountID") || "";
            const id = await validateToken(storedAccountId);
            if (id) {
                AccountID.current = id;
                sessionStorage.setItem("AccountID", id);
                sessionStorage.setItem("Navpos", "portfolio");
                navigate("/stockApp", { replace: true });
            }
        }

        if (firstLoad.current) {
            afun();
            firstLoad.current = false;
        }
        const tokenFromUrl = searchParams.get("token");

        if (tokenFromUrl) {
            //console.log(tokenFromUrl, id);
            // Save the token/Account ID to your global context or session storage
            //console.log("Google Login Successful! Token:", tokenFromUrl);
            AccountID.current = tokenFromUrl;
            if (sessionStorage !== undefined)
                sessionStorage.setItem("AccountID", tokenFromUrl);

            sessionStorage.setItem("Navpos", "portfolio");
            navigate("/stockApp", { replace: true });
        }
    }, [searchParams, navigate]);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        let fla = true;
        //Backend ------------------
        let result = await loginByInput(username, password);
        if (result != null) {
            AccountID.current = result;
            if (sessionStorage !== undefined)
                sessionStorage.setItem("AccountID", result);
            setUsername("");
            setPassword("");
            sessionStorage.setItem("Navpos", "portfolio");
            navigate("/stockApp");
        }
        //Local Storage ----------------------
        /*
        for (let i = 0; i < AccountInfo.current.length; i++) {
            if (AccountInfo.current[i].name == username && AccountInfo.current[i].password == password) {
                fla = false;
                toast.success("login Successfully");
                AccountID.current = AccountInfo.current[i].accountId;
                if (sessionStorage !== undefined)
                    sessionStorage.setItem("AccountID", AccountID.current);
                //console.log(AccountID)
                setUsername("");
                setPassword("");
                sessionStorage.setItem("Navpos", "portfolio");
                navigate("/stockApp");
                break;
            }
            else if (AccountInfo.current[i].name == username) {
                fla = false
                toast.error("Invalid Password");
            }
        }
        if (fla)
            toast.error("Account Not Found");
        */
    };

    const handleSignin = async () => {
        //console.log(AccountInfo.current);
        let flag = 1;
        if (craeteUserName.length <= 3 || createPassword.length <= 3) {
            flag = 0;
            toast.warn("Invalid Username or Password");
            return;
        }
        //backend -------------------
        flag = await addUser(craeteUserName, createPassword);
        if (flag == true) {
            toast.success("Account Created");
            toggleForm("Login");
        }
        else {
            
            //toast.error("Error Occured"); // not nedded
        }

        //LocalStorage Implementation----------------------
        /*
        for (let i = 0; i < AccountInfo.current.length; i++) {
            if (AccountInfo.current[i].name == craeteUserName) {
                toast.error("Already Present");
                flag = 0;
            }
        }
        if (flag == 1) {
            toast.success("created");
            let id = AccountInfo.current.length + 1;
            AccountInfo.current.push({
                "name": craeteUserName,
                "password": createPassword,
                "accountId": ("StockId" + id)
            });
            localStorage.setItem("AccountInfo", JSON.stringify(AccountInfo.current));
            newData.name = craeteUserName;
            localStorage.setItem("StockId" + id, JSON.stringify(newData));
            */
        createUser("");
        createPass("");
        //setSigninInfo([craeteUserName , createPassword])
    }



    let [loginStyle, setloginStyle] = useState({ "display": "block" });
    let [signinStyle, setsigninStyle] = useState({ "display": "none" });




    function googleSignin() {
        // This directly hits the backend endpoint you created in server.js
        window.location.href = 'https://sm-backend-qjvf.onrender.com/auth/google';
    }



    return (
        <div className={styles.Login}>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
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
                <button className={styles.googleLogin} onClick={googleSignin} >
                    <img src={googleImg} className={styles.googleImg} />
                    Continue With Google
                </button>

            </div>

        </div>
    );
}

export default Login;
