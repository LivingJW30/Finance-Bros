import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';
import logo from '../assets/logo.png';

interface NewsItem {
    title: string;
    article_url: string;
}

function Home() {
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setNews(data.news.results || []);
                }
            } catch (e: any) {
                setError(e.toString());
            }
        };

        fetchNews();
    }, []);

    return (
        <div>
            <div id="mainHeader">
                <div className="logo-container">
                    <img src={logo} alt="FinanceBros Logo" className="logo" />
                    <span className="brand-name">FinanceBros</span>
                </div>
            </div>

            {/* News Panel Fixed Left */}
            <div className="news-fixed-left">
                <h2>Latest News</h2>
                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <ul className="news-list">
                        {news.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.article_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Centered Home Content */}
            <div id="homeDiv">
                <h1>Stonks</h1>
                <div className="button-box">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

export default Home;

