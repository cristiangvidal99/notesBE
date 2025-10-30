const express = require('express');
const router = express.Router();
const notes = require('../controllers/notesController');
const login = require('../controllers/loginController');
const health = require('../controllers/healthCheckController');


module.exports = router;