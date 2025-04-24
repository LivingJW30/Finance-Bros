import React, { useEffect, useState } from 'react';

type Snapshot = {
  current: number;
  changeValue: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: string;
};

type Props = {
  tickers: string[];
  onSelect: (ticker: string) => void;
};

function MyStockList({ tickers, onSelect }: Props) {
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({});

  useEffect(() => {
    async function fetchSnapshots() {
      const data: Record<string, Snapshot> = {};

      await Promise.all(
        tickers.map(async (ticker) => {
          console.log("TICKERS ARRAY:"+tickers);
          try {
            const res = await fetch(`https://mern-lab.ucfknight.site/api/ticker-snapshot?ticker=${ticker}`);
            const json = await res.json();

            if (json.success && json.data) {
              data[ticker] = {
                current: json.data.price.close,
                changeValue: json.data.change.value,
                changePercent: json.data.change.percent,
                open: json.data.price.open,
                high: json.data.price.high,
                low: json.data.price.low,
                lastUpdated: json.data.lastUpdated,
              };
            }
          } catch (err) {
            console.error(`Error fetching ${ticker}`, err);
          }
        })
      );

      setSnapshots(data);
    }

    if (tickers.length > 0) fetchSnapshots();
  }, [tickers]);

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
      <h3 style={{ marginTop: 0 }}>My Stocks</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ textAlign: 'left', padding: '1rem' }}>Symbol</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Open</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>High</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Low</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Last Price</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Change</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>% Change</th>
            <th style={{ textAlign: 'right', padding: '1rem' }}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, index) => {
            const snapshot = snapshots[ticker];
            const isUp = snapshot?.changeValue >= 0;

            return (
              <tr
                key={index}
                onClick={() => onSelect(ticker)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#1e1e1e',
                  transition: 'background 0.2s',
                  height: '4rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e1e1e')}
              >
                <td style={{ padding: '1rem' }}><strong>{ticker}</strong></td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                {snapshot?.open !== undefined ? `$${snapshot.open.toFixed(2)}` : '—'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {snapshot?.high !== undefined ? `$${snapshot.high.toFixed(2)}` : '—'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {snapshot?.low !== undefined ? `$${snapshot.low.toFixed(2)}` : '—'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {snapshot?.current !== undefined ? `$${snapshot.current.toFixed(2)}` : '—'}
                </td>
                <td style={{
                  padding: '1rem',
                  textAlign: 'right',
                  color: snapshot ? (isUp ? '#8aff90' : '#f23d4c') : '#888',
                }}>
                  {snapshot?.changeValue !== undefined ? `${isUp ? '+' : ''}${snapshot.changeValue.toFixed(2)}` : '—'}
                </td>
                <td style={{
                  padding: '1rem',
                  textAlign: 'right',
                  color: snapshot ? (isUp ? '#8aff90' : '#f23d4c') : '#888',
                }}>
                  {snapshot?.changePercent !== undefined ? `${snapshot.changePercent.toFixed(2)}%` : '—'}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.8rem', color: '#bbb' }}>
                  {snapshot ? new Date(snapshot.lastUpdated).toLocaleTimeString() : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MyStockList;

