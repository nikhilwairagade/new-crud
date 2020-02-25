require('express-async-errors');
const error = require('./middleware/error');
const express = require('express');
//const Joi = require('joi');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const register = require('./router/registers');
const auth = require('./router/auth');
const student = require('./router/students');
const config = require('config');

process.on('uncaughtException', (ex) => {
	console.log('we got an uncaught Exception');
});
process.on('unhandledRejection', (ex) => {
	console.log('we got an unnhandled rejection');
});

// if (!config.get('jwtPrivateKey')) {
//     console.error('FATAL ERROR:jwtPrivateKey not set')
//     process.exit(1);
// }


app.use(express.static('./htmlPage'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost/college-data', { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log('Connect to MongoDb'))
	.catch(err => console.log('Not Connect', err));

app.use('/api/user_register', register);
app.use('/api/auth', auth);
app.use('/api/student', student);
app.use(error);


app.listen(3000, () => console.log('Listening on port 3000'));
