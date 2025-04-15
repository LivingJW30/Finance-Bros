require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

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
    var error = '';

    try {
        await db.collection('Users').insertOne(newUser);
        error = 'User Added!';
    }
    catch (e) {
        if (e.code === 11000) {
            error = 'Username taken. Please try again';
        }
        else {
            error = e.toString();
        }
    }

    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: username, password
    // outgoing: username (to display on next screen), error

    const {username, password} = req.body;
    var error = '';
    var ret = { username: '', error: '' }; //Defining here so that username isnt null if it doesnt exist

    try {
        const user = await db.collection("Users").findOne({ Username: username }); //Checks to see if user is in database
        if(user) {
            const isMatch = await bcrypt.compare(password, user.Password); //Checks password
            if(isMatch) {
                error = 'Login Success';
                ret.username = user.Username;
            }
            else { //Jumps here if password doesnt exist
                error = 'Invalid Password';
            }
        }
        else { //Jumps here if username doesnt exist
            error = 'User Not Found.';
        }
    }
    catch(e) {
        error = e.toString();
    }
    
    ret.error = error;
    res.status(200).json(ret);
});



app.listen(5001); // start Node + Express server on
