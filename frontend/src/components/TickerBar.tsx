import React, { useEffect, useState } from 'react';
import '../assets/TickerBar.css';

type StockItem = {
    symbol: string;
    price: string;
    isUp: boolean;
};

const tickers = [
    'AAPL',  // Apple
    'TSLA',  // Tesla
    'GOOG',  // Alphabet
    'AMZN',  // Amazon
    'MSFT',  // Microsoft
    'NVDA',  // Nvidia
    'META',  // Meta (Facebook)
    'NFLX',  // Netflix
    'AMD',   // AMD
    'INTC',  // Intel
    'BA',    // Boeing
    'WMT',   // Walmart
    'DIS',   // Disney
    'JPM',   // JPMorgan Chase
    'V',     // Visa
    'MA',    // Mastercard
    'KO',    // Coca-Cola
    'PEP',   // PepsiCo
    'XOM',   // ExxonMobil
    'CVX'    // Chevron
  ];
  

function TickerBar() {
    const [stocks, setStocks] = useState<StockItem[]>([]);

    useEffect(() => {
        async function fetchStocks() {
            const fetchedStocks: StockItem[] = [];

            for (const symbol of tickers) {
                try {
                    const res = await fetch(`https://mern-lab.ucfknight.site/api/ticker-snapshot?ticker=${symbol}`);

                    const data = await res.json();
                    console.log(`[${symbol}] Response:`, data);

                    const lastPrice = data?.results?.ticker?.day?.c;
                    const todaysChange = data?.results?.ticker?.todaysChange ?? 0;
                    

                    fetchedStocks.push({
                        symbol,
                        price: lastPrice ? `$${lastPrice.toFixed(2)}` : 'N/A',
                        isUp: todaysChange >= 0,
                    });
                } catch (err) {
                    fetchedStocks.push({
                        symbol,
                        price: 'N/A',
                        isUp: true,
                    });
                }
            }

            setStocks(fetchedStocks);
        }

        fetchStocks();
    }, []);

    return (
        <div className="ticker-container">
            <div className="ticker-content">
                {[...stocks, ...stocks].map((stock, index) => (
                    <div className="ticker-item" key={index}>
                        <strong>{stock.symbol}</strong>: {stock.price}
                        <span className={stock.isUp ? 'up-arrow' : 'down-arrow'}>
                            {stock.isUp ? ' ▲' : ' ▼'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TickerBar;