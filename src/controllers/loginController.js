const loginService = require('../services/loginService');

const login = async (req, res) => {

    const response = await loginService.loginService(req.body);
    res.status(200).json(response);
}
const register = async (req, res) => {

    const response = await loginService.registerService(req.body);
    res.status(200).json(response);
}
const getUser = async (req, res) => {
    const token = req.get("Authorization").split(" ")[1];
    const response = await loginService.getUserService(token);
    res.status(200).json(response);
}
module.exports = {
    login,
    register,
    getUser
}