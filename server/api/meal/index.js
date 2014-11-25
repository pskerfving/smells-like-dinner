'use strict';

var express = require('express');
var controller = require('./meal.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.index);  // Get the users meals
router.get('/public', controller.index);                      // Get meals available to all users
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;