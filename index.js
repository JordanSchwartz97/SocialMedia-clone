const connectDB = require('./startup/db');
const express = require("express");
const app = express();
const cors = require('cors');
const collections = require('./routes/collections');
const auth = require('./routes/auth');

connectDB();

app.use(cors());
app.use(express.json());


app.use('/api/collections', collections);
app.use('/api/auth', auth);


app.listen(5000, function () {
    console.log("Server started. Listening on port 5000.");
    connectDB();
})