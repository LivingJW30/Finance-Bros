import React, { useEffect, useState } from 'react';

//Define structure for stock data
type Stock = {
    ticker: string;
    name: string;
};

function SearchBar({
    value, //Current input value
    onChange, //Function to update the input value
    onSelect, //Function to handle selection of a stock
}: {
    value: string;
    onChange: (value: string) => void;
    onSelect: (ticker: string) => void;
}) {
    const [suggestions, setSuggestions] = useState<Stock[]>([]); //List of stock suggestions
    const [showDropdown, setShowDropdown] = useState(false); //Controls dropdown visibility

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length === 0) {
                setSuggestions([]); 
                return;
            }

            //Fetch suggestions from the API based on the input value
            const res = await fetch(
                `http://localhost:5001/api/search?query=${encodeURIComponent(value)}`
            );
            const data = await res.json();
            if (!data.error) {
                setSuggestions(data.results); 
                setShowDropdown(true); 
            }
        };

        // Delay api call to avoid excessive requests
        const timeout = setTimeout(fetchSuggestions, 200);
        return () => clearTimeout(timeout); // 
    }, [value]);

    const handleSelect = (ticker: string) => {
        onSelect(ticker); //Notify parent of the selected stock
        setShowDropdown(false); //Hide the dropdown
        onChange(''); //Clear the input field
    };

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px', marginRight: '2rem' }}>
                {/*Input field to search stock */}
                <input
                    type="text"
                    placeholder="Search by ticker or name..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)} // Update input value
                    onFocus={() => value && setShowDropdown(true)} // Show dropdown on focus
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Delay hiding dropdown
                    style={{
                        padding: '0.4rem 0.6rem',
                        width: '100%',
                        fontSize: '0.9rem',
                        backgroundColor: '#2a2a2a',
                        color: '#e0e0e0',
                        border: '1px solid #444',
                        borderRadius: '6px',
                    }}
                />

                {/* Dropdown showing stock suggestions */}
                {showDropdown && suggestions.length > 0 && (
                    <div
                        style={{ 
                            position: 'absolute',
                            top: '120%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#1e1e1e',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            zIndex: 200,
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }}
                    >
                        {suggestions.map((stock, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSelect(stock.ticker)} 
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #333',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = '#333') //Highlight on hover
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = '#1e1e1e') //reset on leave
                                }
                            >
                                {/*Display the stock ticker and name */}
                                <strong>{stock.ticker}</strong>{' '}
                                <span style={{ color: '#aaa' }}>— {stock.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
