var express = require('express');
var router = express.Router();

workers_controller = require('../controllers/worker_controller')


router.get('/', workers_controller.all_workers);


module.exports = router;
