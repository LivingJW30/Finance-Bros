import React, { useEffect, useState } from 'react';

// List of trending stocks
const trendingStocks = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation' },
  { ticker: 'GOOG', name: 'Alphabet Inc. (Google)' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'BAC', name: 'Bank of America Corporation' },
  { ticker: 'XOM', name: 'Exxon Mobil Corporation' },
  { ticker: 'PFE', name: 'Pfizer Inc.' },
  { ticker: 'KO', name: 'The Coca-Cola Company' },
  { ticker: 'PEP', name: 'PepsiCo Inc.' },
  { ticker: 'DIS', name: 'The Walt Disney Company' },
  { ticker: 'CSCO', name: 'Cisco Systems Inc.' },
  { ticker: 'INTC', name: 'Intel Corporation' },
  { ticker: 'ADBE', name: 'Adobe Inc.' },
];

type Snapshot = {
  current: number; // Current stock price
  changeValue: number; // Price change value
  changePercent: number; // Price change percentage
};

type Props = {
  search: string; // Search input value
  onSelect: (ticker: string) => void; // Callback when a stock is selected
};

function StockList({ search, onSelect }: Props) {
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({});

  useEffect(() => {
    async function fetchSnapshots() {
      const data: Record<string, Snapshot> = {};

      await Promise.all(
        trendingStocks.map(async (stock) => {
          try {
            const res = await fetch(
              `https://mern-lab.ucfknight.site/api/ticker-snapshot?ticker=${stock.ticker}`
            );
            const json = await res.json();
            console.log(json);
            if (json.success && json.data) {
              data[stock.ticker] = {
                current: json.data.price.close,
                changeValue: json.data.change.value,
                changePercent: json.data.change.percent,
              };
            }
          } catch (err) {
            console.error(`Error fetching ${stock.ticker}`, err);
          }
        })
      );

      setSnapshots(data);
    }

    fetchSnapshots();
  }, []);

  // Filter stocks based on the search input
  const filteredStocks = trendingStocks.filter((stock) =>
    stock.ticker.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundColor: '#2a2a2a',
        color: '#e0e0e0',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1.5rem',
        flex: 1,
        overflowY: 'auto',
        maxHeight: '80vh',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Trending Stocks</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ textAlign: 'left', padding: '1rem' }}>Symbol</th>
            <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Last Price</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Change</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Percent Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.map((stock, index) => {
            const snapshot = snapshots[stock.ticker];
            const isUp = snapshot?.changeValue >= 0;

            return (
              <tr
                key={index}
                onClick={() => onSelect(stock.ticker)} // Handle stock selection
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#1e1e1e',
                  transition: 'background 0.2s',
                  height: '4rem', 
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#333')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#1e1e1e')
                }
              >
                <td style={{ padding: '1rem' }}>
                  <strong>{stock.ticker}</strong>
                </td>
                <td style={{ padding: '1rem', color: '#aaa' }}>{stock.name}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {snapshot ? `$${snapshot.current.toFixed(2)}` : 'Loading...'}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    color: snapshot ? (isUp ? '#8aff90' : '#f23d4c') : '#888',
                  }}
                >
                  {snapshot ? `${isUp ? '+' : ''}${snapshot.changeValue.toFixed(2)}` : '—'}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'right',
                    color: snapshot ? (isUp ? '#8aff90' : '#f23d4c') : '#888',
                  }}
                >
                  {snapshot ? `${snapshot.changePercent.toFixed(2)}%` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StockList;

