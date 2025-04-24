import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyStockList from '../components/MyStockList';
import QuotePanel from '../components/QuotePanel';
import logo from '../assets/logo.png';

function UserHome() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [myStocks, setMyStocks] = useState<string[]>([]); // Dynamically fetched list of favorite stocks
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user_data') || '{}').username || 'guest';

  // Fetch the user's favorite stocks from the backend
  const fetchFavorites = async () => {
    try {
      const response = await fetch(`https://mern-lab.ucfknight.site/api/get-favorites?username=${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (result.success) {
        setMyStocks(result.data.map((stock: any) => stock.symbol)); // Extract stock symbols
      } else {
        console.error('Failed to fetch favorites:', result.error);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Fetch the favorite stocks when the component mounts
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
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
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="Finance Bros" style={{ height: '36px', borderRadius: '4px' }} />
          <h2 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.25rem' }}>My Stocks</h2>
        </div>
        <button
          onClick={() => navigate('/add-stock')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          + Add Stock
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem', flexGrow: 1, overflow: 'auto' }}>
        <MyStockList tickers={myStocks} onSelect={setSelectedStock} />
      </div>

      {/* Modal for Quote Panel */}
      {selectedStock && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
          onClick={() => setSelectedStock(null)}
        >
          <div
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              boxShadow: '0 0 20px rgba(0,0,0,0.4)',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QuotePanel ticker={selectedStock} onAddStock={fetchFavorites} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;




