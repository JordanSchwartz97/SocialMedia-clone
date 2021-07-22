const connectDB = require('./startup/db');
const express = require("express");
const app = express();
const cors = require('cors');
const collections = require('./routes/collections');

connectDB();

app.use(cors());
app.use(express.json());


<<<<<<< HEAD

app.use('/api/collections', collections)
=======
app.use('/api/collections', collections);
>>>>>>> ab978355dee1a8668e99202460ea8e8828454f22

app.listen(5000, function () {
    console.log("Server started. Listening on port 5000.");
    connectDB();
})