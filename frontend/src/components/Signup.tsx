import { useNavigate } from 'react-router-dom';

function Signup()
{
    const navigate = useNavigate();

    function handleSignupClick() {
        navigate('/home');
    }

    return (
        <div id="signupDiv" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Sign up</h2>
            <input type="text" placeholder="Username" /><br /><br />
            <input type="password" placeholder="Password" /><br /><br />
            <button onClick={handleSignupClick}>Sign Up</button>
        </div>
    );
}

export default Signup;
