var express = require('express');
var router = express.Router();

tables_controller = require('../controllers/table_controller')


router.get('/', tables_controller.all_tables);

router.get('/:number', tables_controller.book_table_get);

router.post('/:number', tables_controller.book_table_post);


module.exports = router;
