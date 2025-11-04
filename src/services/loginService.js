const loginRepository = require('../repository/loginRepository');

const loginService = async (body) => {
    await loginRepository.loginRepository(body);
}
const registerService = async (body) => {
    await loginRepository.registerRepository(body);
}
const getUserService = async (token) => {
    await loginRepository.getUserRepository(token);
}

module.exports = {
    loginService,
    registerService,
    getUserService
}