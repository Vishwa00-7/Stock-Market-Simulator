import React, { useRef, lazy, Suspense } from 'react';
import { createContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import  Loading from "./Loading.jsx";

import './App.css'

//importing Pages
import Login from "./Pages/Login.jsx";
const StockApp = lazy(() => import('./Pages/StockApp.jsx'));

//to make Global Variables
export const Global_Variables = createContext(null);

//React Router DOM -> to Make Multiple windows like = [login , about ,... ]
//specify path in app
//<Route path="/about" element={<About />} />

//change from one path to another
//<Link to="/">Home</Link> | <Link to="/about">About</Link>

function App() {
  const AccountID = useRef(null);

  return (
    <ThemeProvider>
      <Global_Variables.Provider value={AccountID}>
        <BrowserRouter>
          <Routes>
            <Route path ="/" element={<Login />} />
            <Route
              path="/stockApp/*"
              element={
                <Suspense fallback={<Loading/>}>
                  <StockApp />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </Global_Variables.Provider>
    </ThemeProvider>
  )
}

export default App
