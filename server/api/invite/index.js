'use strict';

var express = require('express');
var controller = require('./invite.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
router.put('/:id/accept', controller.accept);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;