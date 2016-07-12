var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Index has been hit.");
	res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res) {
	console.log("Post has been hit.");

	res.on('error', function(err) {
		console.error(err);
	});

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	var responseBody = {
		url: req.response_url,
		text: req.text
	};

	res.write(JSON.stringify(responseBody));
	res.end();
});

module.exports = router;
