const loginService = require('../services/loginService');
const buildLogger = require('../configs/winston.config');
const logger = buildLogger('loginController');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        const response = await loginService.loginService(req.body);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en login controller: ${error.message}`);

        const statusCode = error.status || 401;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al iniciar sesión'
        });
    }
}

const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        const response = await loginService.registerService(req.body);
        res.status(201).json(response);
    } catch (error) {
        logger.error(`Error en register controller: ${error.message}`);

        const statusCode = error.status || 400;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al registrar usuario'
        });
    }
}

const getUser = async (req, res) => {
    try {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'Token de autorización requerido'
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Formato de token inválido. Use: Bearer <token>'
            });
        }

        const response = await loginService.getUserService(token);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en getUser controller: ${error.message}`);

        const statusCode = error.status || 401;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al obtener información del usuario'
        });
    }
}

module.exports = {
    login,
    register,
    getUser
}