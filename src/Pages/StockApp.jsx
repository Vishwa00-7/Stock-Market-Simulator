//Importing Libraries
import React, { lazy, Suspense } from "react";
import { useState, useContext } from "react";
import { Routes, Route } from 'react-router-dom';

import Loading from "../Loading.jsx";


//import { Global_Variables } from "./App.jsx";
import styles from "./StockApp.module.css";

//Importing Components

import Navbar from "../Components/StockApp/Navbar.jsx";

//for content
const Profile = lazy(() => import("../Components/StockApp/Profile.jsx"));
const Portfolio = lazy(() => import("../Components/StockApp/Portfolio.jsx"));
const Movers = lazy(() => import("../Components/StockApp/Movers.jsx"));
const TransactionComponent = lazy(() => import("../Components/StockApp/TransactionComponent.jsx"));
const Watchlist = lazy(() => import("../Components/StockApp/Watchlist.jsx"));
const StockInfo = lazy(() => import("../Components/StockApp/StockInfo.jsx"));
//import Login from "./Login.jsx";

function StockApp(props) {

    //const { ____ , ____ } = usseContext(Global_Variables);

    return (
        <div className={styles.StockApp}>
            <div className={styles.content}>
                <Suspense fallback={<Loading/>}>
                    <Routes>
                        <Route path="watchlist" element={<Watchlist />} />
                        <Route path="movers" element={<Movers />} />
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="transaction" element={<TransactionComponent />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="stockInfo" element={<StockInfo />} />
                        <Route index element={<Portfolio/>}/>
                    </Routes>
                </Suspense>
            </div>
            <Navbar />

        </div>
    );
}

export default StockApp;