var table = require('../models/table')

exports.all_tables = function (req, res, next) {
    table.find()
        .where('occupied').equals(false)
        .exec(function (err, tables) {
            if (err) {
                return next(err);
            }
            res.render('tables', {tables: tables});
        })
};

exports.create_table = function (req, res) {
    res.send('NOT IMPLEMENTED: create_table');
};

exports.book_table_get = function (req, res, next) {
    table.find()
        .where('number').equals(parseInt(req.params.number))
        .exec(function (err, table) {
            if (err) {
                return next(err);
            }
            if (table.number == null) {
                res.sendStatus(404);
            } else {
                res.render('book_table', {table: table});
            }
        })
};

exports.book_table_post = function (req, res) {
    res.send('NOT IMPLEMENTED: create_table');
};




