"use strict";
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const app = require('express')();
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connectiong to mongoDB...'))
    .catch((err) => console.log('failed to connect to mongoDB: ', err));
// MIDDLEWARES
app.use(require('express').json());
app.use(require('express').static(path.join(__dirname, 'images')));
app.use(cors());
app.use(cookieParser());
app.use(require('./middlewares/logger'));
// ROUTES
app.use('/api/books', require('./routers/books'));
app.use('/api/authors', require('./routers/authors'));
app.use('/api/user', require('./routers/user'));
app.use('/auth', require('./routers/auth'));
app.use('/token', require('./routers/acess-token'));
//inserting many
// app.use('/insert', require('./routers/insert'));
// running the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is running on port ', port);
});
