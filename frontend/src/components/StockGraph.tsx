import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

//structure of candlestick data
type CandleData = {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

// imported as unknown to avoid type issues
const TypedReactApexChart = ReactApexChart as unknown as React.FC<{
    options: ApexOptions;
    series: any;
    type: 'candlestick';
    height: number | string;
}>;

function StockChart({ ticker }: { ticker: string | null }) {
    const [data, setData] = useState<CandleData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ticker) return;

        async function fetchChartData() {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://mern-lab.ucfknight.site/api/stockchart?ticker=${ticker}&days=15`
                );
                const json = await res.json();
                if (json.chartData) {
                    setData(json.chartData);
                }
            } catch (err) {
                console.error('Error fetching chart:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchChartData();
    }, [ticker]);

    const series = [
        {
            data: data.map((d) => ({
                x: new Date(d.timestamp),
                y: [d.open, d.high, d.low, d.close],
            })),
        },
    ];

    const highs = data.map(d => Math.max(d.high, d.low));
    const lows = data.map(d => d.low);

    const maxHigh = Math.max(...highs);
    const minLow = Math.min(...lows);

    const roundedMax = Math.ceil(maxHigh / 5) * 5;
    const roundedMin = Math.floor(minLow / 5) * 5;

    const options: ApexOptions = {
        chart: {
            type: 'candlestick',
            background: '#1e1e1e',
            toolbar: { show: true },
            zoom: { enabled: true },
        },
        theme: { mode: 'dark' },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: '#e0e0e0' },
                datetimeFormatter: {
                    day: 'MMM dd',      // Example: "Apr 22"
                    month: 'MMM',       // Optional: "Apr"
                    year: 'yyyy'        // Optional: "2024"
                },
            },
            tooltip: {
                enabled: true,
            },
            tickAmount: 10, // optional, controls how many ticks are shown
        },
        yaxis: {
            min: roundedMin,
            max: roundedMax,
            tooltip: { enabled: true },
            labels: { style: { colors: '#e0e0e0' } },
        },
        tooltip: { theme: 'dark' },
    };


    if (!ticker) return null;

    return (
        <div
            style={{
                width: '100%',
                height: '280px', // Set a fixed height for the container to make the graph taller
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end', // Ensure the bottom of the graph stays in the same spot
            }}
        >
            {loading ? (
                <p style={{ color: '#888', textAlign: 'center' }}>Loading chart...</p>
            ) : (
                <TypedReactApexChart
                    options={options}
                    series={series}
                    type="candlestick"
                    height="100%" // Ensure the graph fills the container height
                />
            )}
        </div>
    );
}

export default StockChart;


