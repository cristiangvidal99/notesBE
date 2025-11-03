const loginService = require('../services/loginService');

const login = async (req, res) => {

    const response = await loginService.loginService(req.body);
    res.status(200).json(response);
}

module.exports = {
    login
}