const express = require('express');
const router = express.Router();
const notes = require('../controllers/notesController');
const login = require('../controllers/loginController');
const health = require('../controllers/healthCheckController');


/**
 * @swagger
 * /api/check:
 *   get:
 *     summary: get status of service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server OK.
 */
router.get("/check", health.check);
router.post("/login", login.login)

module.exports = router;