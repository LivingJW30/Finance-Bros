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
                <div className="auth-buttons">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>

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
                                    className="news-title"
                                >
                                    {item.title}
                                </a>
                                <p className="news-description">
                                    {item.description.split(' ').slice(0, 20).join(' ')}...
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div id="homeDiv">
                <h1>Welcome to FinanceBros</h1>
                <p className="description">
                    FinanceBros is your go-to platform for tracking, learning, and thriving in the world of finance. 
                    We bring you real-time market news, current stock evaluations, and a easy to follow overview of the stock markets performance. 
                    Whether you're a beginner or a seasoned trader, FinanceBros empowers you to make confident financial decisions.
                </p>
                <button className="get-started-button" onClick={() => navigate('/login')}>
                    Get Started Today!
                </button>
            </div>
        </div>
    );
}

export default Home;
