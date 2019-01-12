var express = require('express');
var router = express.Router();
//var ctrlMain = require('../controllers/main');
//var yourModule = require('../controllers/yourModule');
//
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

//
//yourModule.logThis("Ура, работает!");
//var yourModule = require('../controllers/yourModule');


/* Основные страницы. */
router.get('/', ctrlLocations.homelist)
router.get('/location/', ctrlLocations.homelist)
router.get('/location/:locationid', ctrlLocations.locationsInfo)
router.get('/location/:locationid/review/new', ctrlLocations.addReview)
router.post('/location/:locationid/review/new', ctrlLocations.doAddReview)

/* Дополнительные страницы. */
router.get('/about', ctrlOthers.about)
router.get('/sing_in', ctrlOthers.sing_in)

module.exports = router;