import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';
import logo from '../assets/logo.png';

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <div id="mainHeader">
                <div className="logo-container">
                    <img src={logo} alt="FinanceBros Logo" className="logo" />
                    <span className="brand-name">FinanceBros</span>
                </div>
            </div>
            
            <div id="homeDiv">
                <h1>Stonks</h1>
                <div className="button-box">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
