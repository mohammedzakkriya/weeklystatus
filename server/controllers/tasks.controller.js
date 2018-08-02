var config = require('config.json');
var express = require('express');
var router = express.Router();
var taskService = require('services/tasks.service');

// routes
//router.post('/authenticate', authenticate);
router.post('/newtask', createTask);
router.post('/', getAll);
router.post('/pendingtasks', getAllPendingTasks);
//router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;
/*
function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
*/
function createTask(req, res) {
    taskService.create(req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    //console.log('req', req.body);
    taskService.getAll(req.body.firstday, req.body.lastday, req.body.user, req.body.role)
        .then(function (tasks) {
            res.send(tasks);
        })
        .catch(function (err) {y
            res.status(400).send(err);
        });
}

function getAllPendingTasks(req, res) {
    console.log('req', req.body);
    taskService.getAllPendingTasks(req.body.firstday, req.body.lastday, req.body.user, req.body.role)
        .then(function (tasks) {
            console.log('Pending tasks:',tasks);
            res.send(tasks);
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
    taskService.update(req.params._id, req.body)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    taskService.delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}