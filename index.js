const connectDB = require('./startup/db');
const express = require("express");
const app = express();
const cors = require('cors');
const collections = require('./routes/collections');

connectDB();
app.use(cors());
app.use(express.json());




app.listen(5000, function () {
    console.log("Server started. Listening on port 5000.");
    connectDB();
})