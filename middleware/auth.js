const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

    let token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }


    if (!token) {
        return res.status(401).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            return res.status(401).send("Token has expired");
        }
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;