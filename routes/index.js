var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Index has been hit.");
  res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res) {
	console.log("Post has been hit.");
});


// router.post('/adduser', function(req, res) {
//     var db = req.db;
//     var collection = db.get('userlist');
//     collection.insert(req.body, function(err, result){
//         res.send(
//             (err === null) ? { msg: '' } : { msg: err }
//         );
//     });
// });




module.exports = router;
