import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyStockList from '../components/MyStockList';
import QuotePanel from '../components/QuotePanel';
import logo from '../assets/logo.png';
import '../assets/Scroll.css';

function UserHome() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [myStocks, setMyStocks] = useState<string[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<{ symbol: string; price: string; isUp: boolean }[]>([]);
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user_data') || '{}').username || 'guest';

  // Fetch the user's favorite stocks
  const fetchFavorites = async () => {
    try {
      const response = await fetch(`https://mern-lab.ucfknight.site/api/get-favorites?username=${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!result.error) {
        setMyStocks(result.favorites);
      } else {
        console.error('Failed to fetch favorites:', result.error);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Fetch trending stocks
  const fetchTrendingStocks = async () => {
    const tickers = [
      'AAPL', 'TSLA', 'GOOG', 'AMZN', 'MSFT', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
      'BA', 'WMT', 'DIS', 'JPM', 'V', 'MA', 'KO', 'PEP', 'XOM', 'CVX', 'ADBE', 'CRM',
      'PYPL', 'ORCL', 'CSCO', 'IBM', 'SHOP', 'UBER', 'LYFT'
    ];
    const fetchedStocks: { symbol: string; price: string; isUp: boolean }[] = [];

    for (const ticker of tickers) {
      try {
        const res = await fetch(`https://mern-lab.ucfknight.site/api/ticker-snapshot?ticker=${ticker}`);
        const data = await res.json();
        const lastPrice = data?.data?.price?.close;
        const todaysChange = data?.data?.change?.value ?? 0;

        fetchedStocks.push({
          symbol: ticker,
          price: lastPrice ? `$${lastPrice.toFixed(2)}` : 'N/A',
          isUp: todaysChange >= 0,
        });
      } catch (err) {
        fetchedStocks.push({ symbol: ticker, price: 'N/A', isUp: true });
      }
    }

    setTrendingStocks(fetchedStocks);
  };

  useEffect(() => {
    fetchFavorites();
    fetchTrendingStocks();
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
      {/* Ticker Bar */}
      <div
        style={{
          backgroundColor: 'black',
          color: '#e0e0e0',
          padding: '0.5rem 0',
          overflow: 'hidden',
          position: 'relative',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            animation: 'scroll 50s linear infinite',
          }}
        >
          {trendingStocks.concat(trendingStocks).map((stock, index) => (
            <span
              key={index}
              style={{
                marginRight: '2rem',
                color: stock.isUp ? '#8aff90' : '#f23d4c',
                fontWeight: 'bold',
              }}
            >
              {stock.symbol}: {stock.price} {stock.isUp ? '▲' : '▼'}
            </span>
          ))}
        </div>
      </div>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',  }}>
          <img src={logo} alt="Finance Bros" style={{ height: '36px', borderRadius: '4px' }} />
          <h2 style={{ color: '#e0e0e0', fontSize: '1.25rem' }}>FinanceBros</h2>
        </div>

        <div>
          <p style={{ color: '#aaa', fontSize: '1rem',marginLeft: '61px' }}>Welcome, <strong>{username}</strong></p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
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

          <button
            onClick={() => {
              localStorage.removeItem('user_data');
              navigate('/login');
            }}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#dc3545',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
          >
            Log Out
          </button>
        </div>
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
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            zIndex: 200,
            padding: '2rem 0',
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
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
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
