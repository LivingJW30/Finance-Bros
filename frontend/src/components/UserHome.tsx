import { Link } from 'react-router-dom';

function UserHome()
{
    return (
        <div id="userHomeDiv" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>User Home Page</h1>
            <p>This is the user home page after logging in or signing up</p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/add-stock">
                    <button>Add Stocks</button>
                </Link>
            </div>
        </div>
    );
}

export default UserHome;
