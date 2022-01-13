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
    var details = {number: req.body.number, capacity: req.body.capacity, place: req.body.place}
    var newTable = new table(details)
    newTable.save()
    res.send('Стол создан ' + newTable)
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
    body(['phone_number'], '❌ Некорректный формат номера').trim().isMobilePhone('ru-RU'),
    body(['name'], 'Некорректный формат имени').trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        table.findOne()
            .where('number').equals(req.params.number)
            .exec(book_table(errors, res, req, next))
    }
];

function book_table(errors, res, req, next) {
    return function (err, currentTable) {
        if (!errors.isEmpty()) {
            res.render('book_table', {
                table: currentTable,
                customer: req.body,
                message: {text: errors.array()[0].msg}
            });
            return;
        }
        if (currentTable.occupied) {
            res.render('book_table', {
                table: currentTable,
                customer: req.body,
                message: {text: '❌ Столик уже забронирован!'}
            });
            return;
        }
        customer.findOne()
            .where('phone_number').equals(req.body.phone_number)
            .populate('occupied_table')
            .exec(function (err, foundCustomer) {
                console.log(foundCustomer)
                if (err) {
                    return next(err);
                }
                if (foundCustomer == null) {
                    var cust = new customer({
                        phone_number: req.body.phone_number,
                        name: req.body.name,
                        occupied_table: currentTable
                    });
                    console.log('New customer: ' + cust);
                    cust.save()
                } else {
                    if (foundCustomer.occupied_table != null) {
                        res.render('book_table', {
                            table: currentTable,
                            customer: req.body,
                            message: {text: '❌ Вами ранее уже был забронирован другой столик!'}
                        });
                        return;
                    }
                    foundCustomer.occupied_table = currentTable
                    foundCustomer.name = req.body.name
                    foundCustomer.save()
                }
                currentTable.occupied = true
                currentTable.save()
                res.render('book_table', {table: currentTable, customer: req.body, message: {text: '✅ Успех'}});
            });
    };
}

exports.book_table_cancel_get = function (req, res) {
    res.render('cancel_booking')
};

exports.book_table_cancel_post = [
    body(['phone_number'], '❌ Некорректный формат номера').trim().isMobilePhone('ru-RU'),
    (req, res, next) => {
        const errors = validationResult(req);

        customer.findOne()
            .where('phone_number').equals(req.body.phone_number)
            .populate('occupied_table')
            .exec(cancel_booking(errors, res, req, next));
    }
];

function cancel_booking(errors, res, req, next) {
    return function (err, foundCustomer) {
        if (err) {
            return next(err);
        }
        if (!errors.isEmpty()) {
            res.render('cancel_booking', {
                customer: req.body,
                message: {text: errors.array()[0].msg}
            });
            return;
        }
        if (foundCustomer == null) {
            res.render('cancel_booking', {
                customer: req.body,
                message: {text: '❌ Не найден пользователь с таким номером!'}
            });
            return;
        }
        console.log(foundCustomer)
        if (foundCustomer.occupied_table == null) {
            res.render('cancel_booking', {
                customer: req.body,
                message: {text: '❌ Пользователь с таким номером не бронировал столик!'}
            });
            return;
        }
        foundCustomer.occupied_table.occupied = false
        foundCustomer.occupied_table.save()
        foundCustomer.occupied_table = null
        foundCustomer.save()
        res.render('cancel_booking', {customer: req.body, message: {text: '✅ Бронь успешно отменена'}});
    };
}




