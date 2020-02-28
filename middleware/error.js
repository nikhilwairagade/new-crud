module.exports = function (err, req, res) {
	console.log('Error', err);
	res.status(500).send('sonmthing failed');
};