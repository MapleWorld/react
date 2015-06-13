var express = require('express');
var router = express.Router();

router.get('/install', function(req, res) {
	res.render('install', {notif: req.flash('notif')});		
});

module.exports = router;
