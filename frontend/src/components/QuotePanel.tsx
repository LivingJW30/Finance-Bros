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

function QuotePanel({ ticker }: { ticker: string | null }) {
    const [data, setData] = useState<QuoteData | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!ticker) return;

            const [overviewRes, snapshotRes] = await Promise.all([
                fetch(`https://mern-lab.ucfknight.site/api/ticker-overview?ticker=${ticker}&username=test`).then(res => res.json()),
                fetch(`https://mern-lab.ucfknight.site/api/ticker-snapshot?ticker=${ticker}`).then(res => res.json())
            ]);

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
            }
        }

        fetchData();
    }, [ticker]);

    if (!ticker || !data) {
        return (
            <div style={{ color: '#aaa', fontStyle: 'italic' }}>
                Select a stock to view details
            </div>
        );
    }

    return (
        //Container for Quote Panel
        <div
            style={{
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
            {/*Header with logo and ticker (the logo isnt set up yet)*/}
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
                    Market Cap:{' '}
                    <strong>{Intl.NumberFormat().format(data.marketCap)} {data.currency}</strong>
                </p>
                <p>
                    Change Today:{' '}
                    <span style={{ color: data.changeValue >= 0 ? '#8aff90' : '#f23d4c' }}>
                        {data.changeValue >= 0 ? '+' : ''}
                        {data.changeValue.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                    </span>
                </p>
            </div>

            {/* Stock chart/graph (might not work)*/}
            <div style={{ flexGrow: 1, overflow: 'hidden', maxHeight: '300px' }}></div>
            <StockGraph ticker={ticker} />
            <div />
        </div>
    );
}

export default QuotePanel;
