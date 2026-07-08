import { toast } from "react-toastify";


const url = "https://sm-backend-qjvf.onrender.com";




export async function addUser(name, password) {
    try {
        const userInfo = {
            "name": name,
            "password": password
        };
        const resultPromise = await fetch(url + "/signin", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        if (!resultPromise.ok){
            let text = await resultPromise.text();
            toast.error(text);
        }
        return resultPromise.ok;    //Indicates completed
    }
    catch (e) {
        toast.error(e.message);
        return false;   //Indicates Failed
        //or any message....
    }
}

export async function loginByInput(name, password) {
    try {
        const userInfo = {
            "name": name,
            "password": password
        };
        const resultPromise = await fetch(url + "/login/input", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        if (resultPromise.ok) {
            const result = await resultPromise.text();
            return result;
        }
        else {
            const result = await resultPromise.text();
            //console.log(resultPromise,result);
            toast.error(result);
            return null;
        }
    }
    catch (e) {
        toast.error(e.message);
        return null;
        //or any message....
    }
}

export async function clearRefreshToken() {
    try {
        let result = await fetch(url + "/logout", {
            method: "GET",
            credentials: "include"
        });
        // console.log(result);
        return result;
    }
    catch (e) {
        return false;
    }
}


export async function validateToken(token) {
    try {
        const storedToken = token?.trim() || sessionStorage.getItem("AccountID") || "";
        let result = null;
        const flag = await fetch(url + "/checktoken", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                ...(storedToken ? { authorization: "Bearer " + storedToken } : {})
            }
        });

        if (!flag.ok) {
            const resultPromise = await fetch(url + "/generatetoken", {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    ...(storedToken ? { authorization: "Bearer " + storedToken } : {})
                }
            });
            if (resultPromise.ok) {
                result = await resultPromise.text();
                if (result) {
                    sessionStorage.setItem("AccountID", result);
                }
                return result;
            }
            return null;
        }

        return storedToken || null;
    }
    catch (e) {
        return null;
    }
}


export async function getUserInfo(token) {
    try {
        const accessToken = await validateToken(token);
        const resultPromise = await fetch(url + "/userinfo", {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "authorization": "Bearer " + accessToken
            }
        });
        const result = await resultPromise.json();
        //console.log(result)
        return result;
    }
    catch (e) {
        //console.log(e.message);
        return null;

    }
}

export async function updateUserInfo(token, data) {
    try {
        const accessToken = await validateToken(token);
        const resultPromise = await fetch(url + "/userinfo", {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                "authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(data)
        });
        return true;
    }
    catch (e) {
        //console.log(e.message);
        return false;

    }
}



