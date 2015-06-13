var express = require('express');
var router = express.Router();

router.get('/feature', function(req, res) {
	res.render('feature', {notif: req.flash('notif')});		
});

module.exports = router;
