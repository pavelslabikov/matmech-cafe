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
    table.findOne()
        .where('number').equals(req.params.number)
        .exec(function (err, table) {
            console.log(table)
            if (err) {
                return next(err);
            }
            if (table == null) {
                res.sendStatus(404);
            } else {
                res.render('book_table', {table: table});
            }
        })
};

exports.book_table_post = function (req, res) {
    res.send('NOT IMPLEMENTED: create_table');
};




