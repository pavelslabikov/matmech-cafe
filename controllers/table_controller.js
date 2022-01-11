var table = require('../models/table')
var customer = require('../models/customer')
const { body,validationResult } = require('express-validator');

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

exports.book_table_post = [
    body(['phone_number'], 'Некорректный формат номера').trim().isMobilePhone('ru-RU'),
    body(['name'], 'Некорректный формат имени').trim().optional(),
    (req, res) => {
        const errors = validationResult(req);

        table.findOne().where('number').equals(req.params.number)
            .exec(function (err, currTable) {
                if (!errors.isEmpty()) {
                    res.render('book_table', {table: currTable, customer: req.body, errors: errors.array()});
                    return;
                }
                customer.findOne()
                    .where('phone_number').equals(req.body.phone_number)
                    .exec(function (err, foundCustomer) {
                        console.log(foundCustomer)
                        if (err) {
                            return next(err);
                        }
                        if (foundCustomer == null) {
                            var cust = new customer({phone_number: req.body.phone_number, name: req.body.name});
                            console.log('New customer: ' + cust);
                            currTable.customer_id = cust
                        } else {
                            currTable.customer_id = foundCustomer
                        }
                        currTable.occupied = true
                        currTable.save()
                        res.render('book_table', {table: currTable, customer: req.body});
                    })
            })


    }
];




