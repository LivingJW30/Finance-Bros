require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { restClient } = require('@polygon.io/client-js'); //Connects to Polygon
const rest = restClient(process.env.POLYGON_API_KEY);

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;

const client = new MongoClient(url);
client.connect();

const db = client.db("finbros"); //Defined db once so that we dont have to constantly re define this
db.collection("Users").createIndex({ Username: 1 }, { unique: true }); // Makes sure each username is unique

const bcrypt = require('bcrypt'); //For Encryption
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/signup', async (req, res, next) => {
    //incoming: Username, Password (hashed)
    //outgoing: error

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { Username: username, Password: hashedPassword, favorites: [] }; //Initializes empty array for favorites
    let error = '';

    try {
        await db.collection('Users').insertOne(newUser);
        error = 'User Added!';
    }
    catch (e) {
        if (e.code === 11000) {
            error = 'Username taken, Please try again.';
        }
        else {
            error = e.toString();
        }
    }

    let ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: username, password
    // outgoing: username (to display on next screen), error

    const {username, password} = req.body;
    let error = '';
    let ret = { username: '', error: '' }; //Defining here so that username isnt null if it doesnt exist

    try {
        const user = await db.collection("Users").findOne({ Username: username }); //Checks to see if user is in database
        if(user) {
            const isMatch = await bcrypt.compare(password, user.Password); //Checks password
            if(isMatch) {
                error = 'Login Success!';
                ret.username = user.Username;
            }
            else { //Jumps here if password doesnt exist
                error = 'Invalid Password.';
            }
        }
        else { //Jumps here if username doesnt exist
            error = 'User Not Found.';
        }
    }
    catch(e) {
        error = e.toString();
    }
    
    ret.error = error; //Sets error to be returned
    res.status(200).json(ret);
});

app.get('/api/news', async (req, res, next) => { //Endpoint used to fetch news articles
    //outgoing: news array, error
    
    let error = '';
    let news = [];
    
    try {
        news = await rest.reference.tickerNews({
            order: "asc",
            limit: 10, //Can modify if needed (limit is 1000)
            sort: "published_utc"
        });
    }
    catch(e) {
        error = e.toString();
    }

    let ret = { news: news, error: error };
    res.status(200).json(ret);
});

app.get('/api/search', async (req, res, next) => {
    //incoming: search query
    //outgoing: results, error

    const { query } = req.query;
    let error = '';
    let results = [];
    
    try {
        // Make API call to Polygon.io to search for tickers
        const searchResults = await rest.reference.tickers({
            search: query,
            active: true,
            limit: 10,
            sort: 'ticker'
        });
        
        // Extract only ticker and name from the results
        if (searchResults && searchResults.results) {
            results = searchResults.results.map(ticker => ({
                ticker: ticker.ticker,
                name: ticker.name
            }));
        }
    }
    catch(e) {
        error = e.toString();
    }

    let ret = { results: results, error: error };
    res.status(200).json(ret);
});

app.get('/api/stockchart', async (req, res, next) => {
    // incoming: ticker symbol, timeframe
    // outgoing: chart data (timestamps and closing prices), error

    const { ticker, days = 7 } = req.query; // Default to 7 days if not specified
    let error = '';
    let chartData = [];
    
    // Calculate date range (today minus specified days)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);
    
    // Format dates as YYYY-MM-DD for API
    const fromStr = fromDate.toISOString().split('T')[0];
    const toStr = toDate.toISOString().split('T')[0];

    try {
        // Make API call to Polygon.io to get aggregated price data
        const priceData = await rest.stocks.aggregates(
            ticker, 
            1,              // multiplier
            'day',          // timespan
            fromStr,        // from date
            toStr           // to date
        );
        
        // Extract just the closing prices and timestamps
        if (priceData && priceData.results) {
            chartData = priceData.results.map(day => ({
                price: day.c,  // closing price
                timestamp: day.t  // timestamp
            }));
        }
    }
    catch(e) {
        error = e.toString();
    }

    let ret = { chartData: chartData, error: error };
    res.status(200).json(ret);
});

app.listen(5001); // start Node + Express server on