import React, { useState } from 'react';
import '../assets/Signup.css';
import logo from '../assets/logo.png';
import homeIcon from '../assets/home-icon.png';


function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); //should allow us to toggle pw veiwing
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            setMessage(result.error);

            // Redirect to home on success (optional)
            if (result.error === 'User Added!') {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }else if(result.error === 'Username taken, Please try again.'){
                setMessage('Username taken, Please try again.');
                return;
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
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

            <div id="signupDiv">
                <div className="button-box">
                    <h1>Sign up</h1>
                    <form onSubmit={handleSubmit}>
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

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        /><br /><br />

                       <label>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(prev => !prev)}
                            /> Show Password
                        </label><br /><br />

                        <button type="submit">Sign Up</button>

    			<p style={{ marginTop: '1rem' }}>
        		    <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            			Already have an account? Login here!
        		    </a>
    			</p>
                    </form>

                    {message && <p style={{ marginTop: '1rem', color: '#8AFF90' }}>{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Signup;
