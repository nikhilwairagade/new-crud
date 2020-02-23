const express = require('express');
const Joi = require('joi');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const register = require('./router/registers')
const auth = require('./router/auth');
const student = require('./router/students');

app.use(express.static('./htmlPage'));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/college-data', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("Connect to MongoDb"))
    .catch(err => console.log("Not Connect", err))

app.use('/api/user_register', register);
app.use('/api/auth', auth);
app.use('/api/student', student);


app.listen(3000, () => console.log('Listening on port 3000'));
