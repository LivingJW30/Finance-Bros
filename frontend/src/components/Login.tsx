import React, { useState } from 'react';
import '../assets/Login.css';
import logo from '../assets/logo.png';
import homeIcon from '../assets/home-icon.png';


function Login()
{
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); //should allow us to toggle pw veiwing
    

    async function doLogin(event: React.FormEvent): Promise<void>
    {
        event.preventDefault();
        const obj = { username: username, password: password };
        const js = JSON.stringify(obj);

        try
        {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (res.error === 'Login Success!')
            {
                const user = { username: res.username };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/Home';
            }
            else
            {
                setMessage(res.error);
            }
        }
        catch(error: any)
        {
            alert(error.toString());
        }
    };

    return (
        <div>
            <header id="mainHeader">
                <a href="/" className="home-button">
                    <img src={homeIcon} alt="Home" />
                </a>

                <div className="logo-container">
                <a href="/">
        	     <img src={logo} alt="FinanceBros Logo" className="logo" />
    		</a>
                </div>
            </header>

            <div id="loginDiv">
                <div className="button-box">
                    <h1>Login</h1>
                    <form onSubmit={doLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        /><br /><br />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        /><br /><br />

                       <label>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(prev => !prev)}
                            /> Show Password
                        </label><br /><br />

                        <button type="submit">Login</button>
    			<p style={{ marginTop: '1rem' }}>
        		    <a href="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
            			Don't have an account? Register here
        		    </a>
    			</p>
                    </form>

                    {message && <p style={{ marginTop: '1rem', color: '#8AFF90' }}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
