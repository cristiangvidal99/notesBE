const loginRepository = require('../repository/loginRepository');
const buildLogger = require('../configs/winston.config');
const logger = buildLogger('loginService');

const loginService = async (body) => {
    try {
        const { data, error } = await loginRepository.loginRepository(body);

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: data.user,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
                expires_in: data.session.expires_in
            }
        };
    } catch (error) {
        logger.error(`Error en loginService: ${error.message}`);
        throw error;
    }
}

const registerService = async (body) => {
    try {
        const { data, error } = await loginRepository.registerRepository(body);

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: data.user,
            message: 'Usuario registrado exitosamente. Por favor verifica tu email.'
        };
    } catch (error) {
        logger.error(`Error en registerService: ${error.message}`);
        throw error;
    }
}

const getUserService = async (token) => {
    try {
        const { data, error } = await loginRepository.getUserRepository(token);

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: data.user
        };
    } catch (error) {
        logger.error(`Error en getUserService: ${error.message}`);
        throw error;
    }
}

module.exports = {
    loginService,
    registerService,
    getUserService
}