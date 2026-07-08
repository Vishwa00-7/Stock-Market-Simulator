function getCredentials(provider) {
    let apiKey = null;
    if (provider == "alphavantage")
        apiKey == "Y4L3KZSV5XCPRG4Q";
    else if (provider == "polygon")
        apiKey = "C3uFeFOdisqIhuiByEWBtc2PTmwFjZHq";
    else if (provider == "twelvedata")
        apiKey = "fccf55e6487b47f094ea2521e4019370";
    else
        apiKey = "d8ud75hr01qinhuh8m30d8ud75hr01qinhuh8m3g"
    return { provider, apiKey };
}

export async function executeCurrentPrice(symbol) {
    const { provider, apiKey } = getCredentials("finhub");
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await res.json();
    return {
        symbol,
        currentPrice: data.c,
        open: data.o,
        high: data.h,
        low: data.l,
        change: +(data.c - data.pc).toFixed(2),
        changePct: (((data.c - data.pc) / data.pc) * 100).toFixed(2) + "%"
    };
}

export async function executeHistoricalPrices(symbol, viewby) {
    const { provider, apiKey } = getCredentials("polygon");
    const today = new Date().toISOString().split('T')[0];
    
    let fromDate = new Date();
    let split = 1;
    let unit = "day";
    let isIntraday = false; // Flag to determine how we format the final date

    if (viewby == "D") {
        fromDate.setDate(fromDate.getDate() - 1);
        split = 30;    // 30 minutes
        unit = "minute";
        isIntraday = true;
    }
    else if (viewby == "W") {
        fromDate.setDate(fromDate.getDate() - 7);
        split = 6;     // 6 hours
        unit = "hour";
        isIntraday = true;
    }
    else if (viewby == "M") {
        fromDate.setMonth(fromDate.getMonth() - 1);
        split = 1;     // 1 day
        unit = "day";
    }
    else {
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        split = 1;     // 1 week
        unit = "week";
    }

    const fromDateStr = fromDate.toISOString().split('T')[0];
    
    // Increased limit to 5000 to prevent yearly truncation, and swapped in the dynamic apiKey
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${split}/${unit}/${fromDateStr}/${today}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();
    
    return (data.results || []).map(r => {
        // Create full ISO string (e.g. 2026-06-27T14:30:00.000Z)
        const fullDate = new Date(r.t).toISOString();
        let datewithtime = fullDate.slice(0,16);
        datewithtime = datewithtime.replace("T" , " ");
        return {
            // Keep the time if intraday, otherwise strip it to just YYYY-MM-DD
            date: isIntraday ? datewithtime : fullDate.split('T')[0], 
            open: r.o, 
            high: r.h, 
            low: r.l, 
            close: r.c
        };
    });
}


/*
export async function executeHistoricalPrices(symbol, viewby) {
    const { provider, apiKey } = getCredentials("polygon");
    const today = new Date().toISOString().split('T')[0];
    let fromDate = new Date;
    let split = 1;
    let unit = "day";

    if (viewby == "D") {
        fromDate = fromDate.setDate(fromDate.getDate() - 1);
        split = 30;     //30 minutes
        unit = "minute";
    }
    else if (viewby == "W") {
        fromDate = fromDate.setDate(fromDate.getDate() - 7);
        split = 6;     //6 hours
        unit = "hour";
    }
    else if (viewby == "M") {
        fromDate = new Date();
        fromDate = fromDate.setMonth(fromDate.getMonth() - 1);
        split = 1;     //1 day
        unit = "day";
    }
    else {
        fromDate = new Date();
        fromDate = fromDate.setFullYear(fromDate.getFullYear() - 1);
        split = 1;     //1 week
        unit = "week";
    }
    // console.log(fromDate , Date(fromDate));
    fromDate = new Date(fromDate).toISOString().split('T')[0];

    // console.log(split, unit, fromDate, today);

    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${split}/${unit}/${fromDate}/${today}?adjusted=true&sort=desc&limit=30&apiKey=C3uFeFOdisqIhuiByEWBtc2PTmwFjZHq`);
    const data = await res.json();
    // console.log(res);
    return (data.results || []).map(r => ({
        date: new Date(r.t).toISOString().split('T')[0], open: r.o, high: r.h, low: r.l, close: r.c
    }));
}*/

export async function executeCompanyMetadata(symbol) {
    const { provider, apiKey } = getCredentials("polygon");
    const res = await fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`);
    const data = await res.json();
    return data.results || data;
}

export async function executeMovers() {
    const { provider, apiKey } = getCredentials("alphavantage");

    const res = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);
    return await res.json();
}

export async function executeSearch(query) {
    const { provider, apiKey } = getCredentials("finhub");
    const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&exchange=US&token=${apiKey}`);
    return await res.json();
}

export async function executeName(symbol){
    const { provider, apiKey } = getCredentials("finhub");
    const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
    const data = await res.json();
    return data.name;
}

export async function executePrice(){
    const { provider, apiKey } = getCredentials("finhub");
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await res.json();
    return data.c;
}