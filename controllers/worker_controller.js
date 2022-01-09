var worker = require('../models/worker')

exports.all_workers = function (req, res, next) {
    worker.find()
        .exec(function (err, workers) {
            if (err) {
                return next(err);
            }
            res.render('workers', {workers: workers});
        })
};

exports.create_worker = function (req, res) {
    res.send('NOT IMPLEMENTED: create_table');
};

exports.modify_worker = function (req, res) {
    res.send('NOT IMPLEMENTED: modify_table');
};
