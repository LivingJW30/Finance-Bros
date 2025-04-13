import { Link } from 'react-router-dom';

function Home()
{
    return (
        <div id="homeDiv" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>Finance-Bros</h1>
            <p>Login or sign up to continue</p>

            <div style={{ marginTop: '2rem' }}>
                <Link to="/login">
                    <button style={{ marginRight: '1rem' }}>Login</button>
                </Link>
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
