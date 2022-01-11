var express = require('express');
var router = express.Router();

tables_controller = require('../controllers/table_controller')


router.get('/', tables_controller.all_tables);

router.get('/:number', tables_controller.book_table_get);

router.post('/:number', tables_controller.book_table_post);

router.get('/cancel', tables_controller.book_table_cancel_get);

router.post('/cancel', tables_controller.book_table_cancel_post);

module.exports = router;
