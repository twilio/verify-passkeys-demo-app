import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';

import Home from './pages/Home';
import SignIn from './pages/SignIn'
import Register from './pages/Register';
import Factors from './pages/Factors';
import Challenges from "./pages/Challenges";
import AppContextProvider from "./context/AppContextProvider";



function App() {
  return (
      <AppContextProvider>
          <BrowserRouter>
              <Routes>
                    <Route path='/' element={<Header />}>
                        <Route index element={<Home />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/sign-in' element={<SignIn />} />
                        <Route path='/factors' element={<Factors />} />
                        <Route path='/challenges' element={<Challenges />} />
                    </Route>
              </Routes>
          </BrowserRouter>
      </AppContextProvider>
  );
}

export default App;
