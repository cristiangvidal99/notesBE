const { getUser } = require("../controllers/loginController");

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const { data, error } = getUser(token);

    if (error) return res.status(401).json({ error: error.message });

    req.user = data.user;
    next();
};

module.exports = {
    auth
}