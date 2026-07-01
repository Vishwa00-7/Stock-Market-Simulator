import React, { useRef } from "react";
import { useState, useContext, useEffect } from "react";
import { Global_Variables } from "../../App.jsx";
import { executeMovers, executeName } from "../../Pages/AboutStock.jsx";

import SearchCard from "../Minor_Components/SearchCard.jsx";
import styles from "./Movers.module.css";

function Movers(props) {

    //const AccountID = useContext(Global_Variables);
    const GainersData = useRef(undefined);          //contains list of [symbol , name , changePct]
    const LoosersData = useRef(undefined);

    const [cardListG, setCardListG] = useState([]);
    const [cardListL, setCardListL] = useState([]);

    const gainersDisplay = useRef(null);
    const losersDisplay = useRef(null);
    const [Render, doRender] = useState(false);

    useEffect(() => {
        let movers = undefined;
        const today = new Date().toDateString();

        function generateCard() {

            let gl = GainersData.current.data.map((element, index) => {
                return (<SearchCard info={[element[0], element[1]]}
                    addinfo={[element[2], true, "%"]}
                    pos={index} />)
            });

            let ll = LoosersData.current.data.map((element, index) => {
                return (<SearchCard info={[element[0], element[1]]}
                    addinfo={[element[2], true, "%"]}
                    pos={index + 10} />)
            });


            setCardListG(gl);
            setCardListL(ll);
        }

        async function fetchData() {
            let temp = await executeMovers();
            movers = [];
            console.log(temp); //--------------

            for (let i = 0; i < 10; i++) {
                let symbol = temp.top_gainers[i].ticker;
                let name = await executeName(symbol);
                //console.log(name);
                let changePct = temp.top_gainers[i].change_percentage.slice(0, -1);
                changePct = parseFloat(changePct).toFixed(2);
                movers.push([symbol, name, changePct]);
            }
            GainersData.current = { "day": today, "data": movers };
            localStorage.setItem("Gainers", JSON.stringify({ "day": today, "data": movers }));

            movers = [];

            for (let i = 0; i < 10; i++) {
                let symbol = temp.top_losers[i].ticker;
                let name = await executeName(symbol);
                let changePct = temp.top_losers[i].change_percentage.slice(0, -1);
                changePct = parseFloat(changePct).toFixed(2);
                movers.push([symbol, name, changePct]);
            }
            LoosersData.current = { "day": today, "data": movers };
            localStorage.setItem("Losers", JSON.stringify({ "day": today, "data": movers }));
            console.log("from api" , GainersData ,LoosersData);
            generateCard();

        }

        if (localStorage !== undefined) {

            movers = localStorage.getItem("Gainers");
            movers = JSON.parse(movers);
            if (movers != undefined && movers.day == today)
                GainersData.current = movers;
            movers = localStorage.getItem("Losers");
            movers = JSON.parse(movers);
            if (movers != undefined && movers.day == today)
                LoosersData.current = movers;
            console.log("from storage" , GainersData ,LoosersData);

        }
        console.log(GainersData.current)

        if (GainersData.current == undefined || GainersData.current.length == 0)
            fetchData();
        else
            generateCard();

        console.log("all data", GainersData.current, LoosersData.current); 
                //-----------
        

    }, []);

    function swap() {
        //conditional rendering 
        //console.log(gainersDisplay.current.style.display);
        if (gainersDisplay.current.style.display == "none") {
            gainersDisplay.current.style.display = "block";
            losersDisplay.current.style.display = "none";
        }
        else {
            gainersDisplay.current.style.display = "none";
            losersDisplay.current.style.display = "block";
        }
        doRender(!Render);
    }




    return (
        <div className={styles.movers}>
            <h1 className={styles.heading}>Movers</h1>
            <button className={styles.swapbtn} onClick={swap}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z" /></svg>
            </button>
            <br />
            <div className={styles.moverscontent}>

                <div className={styles.topgainers} ref={gainersDisplay}>
                    <h2 className={styles.gheading}>Top Gainers</h2>
                    <div className={styles.gainerscontent}>
                        {cardListG}
                    </div>
                </div>

                <div className={styles.toplosers} ref={losersDisplay}>
                    <h2 className={styles.lheading}>Top Losers</h2>
                    <div className={styles.loserscontent}>
                        {cardListL}
                    </div>
                </div>
            </div>
            <br />

            <br />
        </div>
    );
}

export default Movers;