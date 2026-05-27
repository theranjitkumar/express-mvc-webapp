var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    year: new Date().getFullYear()
  });
});

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About',
    year: new Date().getFullYear()
  });
});

router.get('/contact', function (req, res, next) {
  res.render('contact', {
    title: 'Contact',
    year: new Date().getFullYear()
  });
});

module.exports = router;
