require('express-async-errors');
const error = require('./middleware/error');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const register = require('./router/registers');
const auth = require('./router/auth');
const student = require('./router/students');
const config = require('config');

process.on('uncaughtException', () => {
	console.log('we got an uncaught Exception');
});
process.on('unhandledRejection', () => {
	console.log('we got an unnhandled rejection');
});

// if (!config.get('jwtPrivateKey')) {
//     console.error('FATAL ERROR:jwtPrivateKey not set')
//     process.exit(1);
// }


app.use(express.static('./htmlPage'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const db = config.get('db');
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log(`Connect to MongoDb${db}`))
	.catch(err => console.log('Not Connect', err));

app.use('/api/user_register', register);
app.use('/api/auth', auth);
app.use('/api/student', student);
app.use(error);

//console.log('PAssword=', config.get('jwtPrivateKey.password'));
const server = app.listen(3000, () => console.log('Listening on port 3000'));

module.exports = server;