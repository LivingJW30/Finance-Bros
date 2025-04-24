import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import StockList from './StockList';
import QuotePanel from './QuotePanel';
import logo from '../assets/logo.png';

function AddStock() {
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate(); // React Router's navigate function

    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
    }, []);

    return (
        // Container for full-screen layout
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            {/*Header*/}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#2a2a2a',
                    padding: '1rem 2rem',
                    borderBottom: '1px solid #333',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Left side logo and title*/}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src={logo}
                        alt="Finance Bros"
                        style={{ height: '36px', borderRadius: '4px' }}
                    />
                    <h2 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.25rem' }}>Add Stock</h2>
                </div>

                {/* Right: Search Bar */}
                <SearchBar value={searchTerm} onChange={setSearchTerm} onSelect={setSelectedStock} setSuggestions={setSuggestions} />
            </div>


            {/* Main content*/}
            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    padding: '2rem',
                    flexGrow: 1,
                    overflow: 'auto',
                }}
            >
                <StockList search={searchTerm} onSelect={setSelectedStock} suggestions={suggestions}/>
                <QuotePanel
                    ticker={selectedStock}
                    onAddStock={() => {
                        if (selectedStock) {
                            navigate('/home', { state: { newStock: selectedStock } }); // Pass stock to UserHome
                        } else {
                            alert('Please select a stock to add.');
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default AddStock;
