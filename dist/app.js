"use strict";
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = require('express')();
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connectiong to mongoDB...'))
    .catch((err) => console.log('failed to connect to mongoDB: ', err));
// MIDDLEWARES
app.use(require('express').json());
app.use(require('express').static(path.join(__dirname, 'images')));
app.use(require('./middlewares/logger'));
app.use(cors());
// ROUTES
app.use('/api/books', require('./routers/books'));
app.use('/api/authors', require('./routers/authors'));
app.use('/api/auth', require('./routers/auth'));
app.use('/api/users', require('./routers/users'));
//inserting many
// app.use('/insert', require('./routers/insert'));
//token check
app.use('/api', require('./routers/token'));
// running the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is running on port ', port);
});
