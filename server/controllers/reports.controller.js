var config = require('config.json');
var express = require('express');
var router = express.Router();
var reportService = require('services/reports.service');

// routes
//router.post('/authenticate', authenticate);
router.post('/new', createReport);
router.post('/', getAll);

//router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function createReport(req, res) {
    reportService.create(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    console.log('req', req.body);
    reportService.getAll(req.body.user, req.body.role)
        .then(function (projects) {
            res.send(projects);
        })
        .catch(function (err) {y
            res.status(400).send(err);
        });
}
/*
function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
*/
function update(req, res) {
    reportService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    reportService.delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}