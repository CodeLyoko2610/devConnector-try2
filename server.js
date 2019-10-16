const express = require('express');
const connectDB = require('./config/db');

//Initialize Express
const app = express();
//Connect database
connectDB();
//Connect app
app.get('/', (req, res) => {
    res.send('API is running.');
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
