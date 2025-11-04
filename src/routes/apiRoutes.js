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
router.post("/register", login.register)
router.post("/login", login.login)
router.get("/getUser", login.getUser)

module.exports = router;