const express = require('express');
const router = express.Router();

const indexController = require('./controllers/index.controller');

router.put('/getNearSubwayStation', indexController.getNearStation);
router.put('/getStationInfo', indexController.getStationInfo);

module.exports = router;
