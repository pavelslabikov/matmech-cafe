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