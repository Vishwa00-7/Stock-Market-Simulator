import React, { useEffect } from "react";
import { useState , useContext ,useRef } from "react";
import { Global_Variables } from "../../App.jsx";

import styles from "./Watchlist.module.css";
import SearchCard from "../Minor_Components/SearchCard.jsx";
import { executeSearch } from "../../Pages/AboutStock.jsx";

function Watchlist(props){

    //const { ____ , ____ } = usseContext(Global_Variables);
    const [searchValue , setSearchValue] = useState("");
    const [searchCardList , changeSearchCardList ]  = useState();
    const [watchlistCard , setWatchlistCard ] = useState();

    let AccountID = useContext(Global_Variables);
    const accountData = useRef(undefined);
    const inputElement = useRef(null);
    

    

    async function search(e){
        

        setSearchValue(e.target.value);
        if (searchValue != ""){
            let result = await executeSearch(searchValue);
            result = result.result;
            //console.log(result);        //-------------------
            let l = result.map((element , index) => {
                return (<SearchCard  info={[ element.symbol , element.description]} 
                    addinfo={[null , null ]} pos = {index}/>)
            })
            changeSearchCardList(l);
        }
    }

    useEffect( () => {
        if (AccountID.current === null || AccountID.current === undefined){
            if (sessionStorage !== undefined)
                AccountID.current = sessionStorage.getItem("AccountID");
        }
        
        if (Storage !== undefined) {
            console.log(AccountID.current)
            accountData.current = localStorage.getItem(AccountID.current);
            accountData.current = JSON.parse(accountData.current);
            //console.log(accountData.current);
        }
        let wl = (accountData.current).watchlist;
        //console.log("----" ,wl)
        if (wl.length != 0){
        let rl = wl.map((element , index) => {
                return (<SearchCard  info ={[ element[0] , element[1]]}
                        addinfo={[null , null ]} pos = {index}/>)
        });
        setWatchlistCard(rl);}
    } , [])


    function stopFocus(){
        //console.log("inputElemnt" , inputElement);
        if (inputElement !== null && inputElement !== undefined)
            inputElement.blur();
    }




    return (
        <div className={styles.watchlist}>
            <div className={styles.searchbar}>
                <input ref={inputElement} type="text" className={styles.searchbox} value={searchValue}
                 placeholder="Search by Name"
                 onChange={(e) =>{ e.preventDefault(); search(e);}} />
                <button className={styles.searchbtn} onClick={stopFocus} >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                </button>
            </div>
            {(searchValue == "") && <div className={styles.searchcontent}>
                {watchlistCard}
                <br/>
            </div>}
            {(searchValue != "") && <div className={styles.searchcontent}>
                {searchCardList}
                <br/>
            </div>}
        </div>
    );
}

export default Watchlist;