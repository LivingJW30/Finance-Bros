import React, { useEffect, useState } from 'react';

//Preset list of trending stocks
// Could maybe have them be fetched from api in the future
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
];

type Snapshot = {
  current: number; //Current stock price
  changeValue: number; //Price change value
  changePercent: number; //Price change percentage
};

type Props = {
  search: string; //Search input value
  onSelect: (ticker: string) => void; //Callback when a stock is selected
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

            if (json.success && json.data) {
              data[stock.ticker] = {
                current: json.data.price.current,
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

  //Find stocks that match the search input
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
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Trending Stocks</h3>
      {filteredStocks.map((stock, index) => {
        const snapshot = snapshots[stock.ticker];
        const isUp = snapshot?.changeValue >= 0;

        return (
          <div
            key={index}
            onClick={() => onSelect(stock.ticker)} //Handle stock selection
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1e1e1e',
              padding: '1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              border: '1px solid #444',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#333')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#1e1e1e')
            }
          >
            <div style={{ flex: 1 }}>
              <strong>{stock.ticker}</strong>{' '}
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                — {stock.name}
              </span>
            </div>

            {snapshot ? (
              <div style={{ textAlign: 'right', minWidth: '130px' }}>
                <div>${snapshot.current.toFixed(2)}</div>
                <div
                  style={{
                    color: isUp ? '#4caf50' : '#f44336',
                    fontSize: '0.85rem',
                  }}
                >
                  {isUp ? '+' : ''}
                  {snapshot.changeValue.toFixed(2)} (
                  {snapshot.changePercent.toFixed(2)}%)
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Loading...</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StockList;

