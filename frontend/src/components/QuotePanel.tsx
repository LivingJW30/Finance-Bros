import React, { useEffect, useState } from 'react';
import StockGraph from './StockGraph';

type QuoteData = {
  name: string;
  description: string;
  industry: string;
  marketCap: number;
  currency: string;
  changePercent: number;
  changeValue: number;
  logo: string;
};

function QuotePanel({ ticker, onAddStock }: { ticker: string | null, onAddStock?: () => void }) {
  console.log('📦 QuotePanel received ticker:', ticker);

  const [data, setData] = useState<QuoteData | null>(null);
  const username = JSON.parse(localStorage.getItem('user_data') || '{}').username || 'guest';

  useEffect(() => {
    async function fetchData() {
      if (!ticker || !username) {
        console.warn('🚫 Missing ticker or username');
        return;
      }

      console.log('📡 Fetching data for:', ticker, 'as user:', username);

      try {
        const [overviewRes, snapshotRes] = await Promise.all([
          fetch(`http://localhost:5001/api/ticker-overview?ticker=${ticker}&username=${username}`).then((res) => res.json()),
          fetch(`http://localhost:5001/api/ticker-snapshot?ticker=${ticker}`).then((res) => res.json())
        ]);

        console.log('✅ Overview response:', overviewRes);
        console.log('✅ Snapshot response:', snapshotRes);

        if (overviewRes.success && snapshotRes.success) {
          setData({
            name: overviewRes.data.company.name,
            description: overviewRes.data.company.description,
            industry: overviewRes.data.company.industry,
            marketCap: overviewRes.data.financials.marketCap,
            currency: overviewRes.data.financials.currency,
            changePercent: snapshotRes.data.change.percent,
            changeValue: snapshotRes.data.change.value,
            logo: overviewRes.data.branding.logo,
          });
        } else {
          console.error('❌ One or both API responses unsuccessful');
        }
      } catch (err) {
        console.error('🔥 Error fetching quote data:', err);
      }
    }

    fetchData();
  }, [ticker, username]);

  const handleAddStock = async () => {
    if (!ticker) return;

    try {
      const response = await fetch('http://localhost:5001/api/add-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, username }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`${ticker} added to your favorites!`);
        if (onAddStock) onAddStock(); // Notify parent component to refresh the list
      } else {
        alert(result.error || 'Failed to add stock.');
      }
    } catch (error) {
      console.error('🔥 Error adding stock:', error);
      alert('An error occurred while adding the stock.');
    }
  };

  if (!ticker || !data) {
    return (
      <div style={{ color: '#aaa', fontStyle: 'italic' }}>
        Select a stock to view details
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#2a2a2a',
        color: '#e0e0e0',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '600px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Add Stock Button */}
      <button
        onClick={handleAddStock}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#28a745',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
      >
        + Add Stock
      </button>

      {/* Ticker Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {data.logo && (
          <img src={data.logo} alt="logo" style={{ height: '40px', borderRadius: '4px' }} />
        )}
        <h2 style={{ margin: 0 }}>{ticker}</h2>
      </div>

      <p style={{ fontWeight: 'bold', margin: 0 }}>{data.name}</p>
      <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0 }}>{data.industry}</p>
      <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{data.description}</p>

      <div style={{ fontSize: '0.95rem' }}>
        <p>
          Market Cap: <strong>{Intl.NumberFormat().format(data.marketCap)} {data.currency}</strong>
        </p>
        <p>
          Change Today:{' '}
          <span style={{ color: data.changeValue >= 0 ? '#8aff90' : '#f23d4c' }}>
            {data.changeValue >= 0 ? '+' : ''}
            {data.changeValue.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </span>
        </p>
      </div>

      <div style={{ flexGrow: 1, overflow: 'hidden', maxHeight: '300px' }}>
        <StockGraph ticker={ticker} />
      </div>
    </div>
  );
}

export default QuotePanel;



