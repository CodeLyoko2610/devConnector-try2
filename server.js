const express = require('express');
const connectDB = require('./config/db');

//Initialize (Init) Express
const app = express();
//Connect database
connectDB();
//Init middleware
app.use(express.json({ extended: false }));
//Connect app
app.get('/', (req, res) => {
    res.send('API is running.');
});

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
