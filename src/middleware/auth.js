const loginService = require("../services/loginService");
const buildLogger = require("../configs/winston.config");
const logger = buildLogger("authMiddleware");

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'Token de autorización requerido'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Formato de token inválido. Use: Bearer <token>'
            });
        }

        const response = await loginService.getUserService(token);

        if (!response.success || !response.user) {
            logger.error(`Error de autenticación: Usuario no encontrado`);
            return res.status(401).json({
                success: false,
                error: 'Token inválido o expirado'
            });
        }

        req.user = response.user;
        next();
    } catch (error) {
        logger.error(`Error en middleware de autenticación: ${error.message}`);
        return res.status(401).json({
            success: false,
            error: 'Error al validar el token de autenticación'
        });
    }
};

module.exports = {
    auth
}