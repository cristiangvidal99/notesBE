const loginRepository = require('../repository/loginRepository');

const loginService = async (body) => {
    await loginRepository.loginRepository(body);
}

module.exports = {
    loginService
}