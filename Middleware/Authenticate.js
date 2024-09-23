const jwt = require("jsonwebtoken");
const TokenModel = require('../Model/TokenModel'); // Import the Token Model

async function verifyAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const storedToken = await TokenModel.findOne({ token });
        if (!storedToken) {
            return res.status(401).json({
                status: 401,
                result: "Fail",
                message: "Unauthorized or Token Expired"
            });
        }
        jwt.verify(token, process.env.JWT_KEY_FOR_ADMIN, (error) => {
            if (error) {
                return res.status(440).json({
                    status: 440,
                    result: "Fail",
                    message: "Session Expired. Please Login Again"
                });
            } else {
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 401,
            result: "Fail",
            message: "Unauthorized Activity"
        });
    }
}

async function verifyUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const storedToken = await TokenModel.findOne({ token });
        if (!storedToken) {
            return res.status(401).json({
                status: 401,
                result: "Fail",
                message: "Unauthorized or Token Expired"
            });
        }
        jwt.verify(token, process.env.JWT_KEY_FOR_USER, (error) => {
            if (error) {
                return res.status(440).json({
                    status: 440,
                    result: "Fail",
                    message: "Session Expired. Please Login Again"
                });
            } else {
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 401,
            result: "Fail",
            message: "Unauthorized Activity"
        });
    }
}

async function verifyBoth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const storedToken = await TokenModel.findOne({ token });
        if (!storedToken) {
            return res.status(401).json({
                status: 401,
                result: "Fail",
                message: "Unauthorized or Token Expired"
            });
        }
        jwt.verify(token, process.env.JWT_KEY_FOR_ADMIN, (adminError) => {
            if (adminError) {
                jwt.verify(token, process.env.JWT_KEY_FOR_USER, (buyerError) => {
                    if (buyerError) {
                        return res.status(440).json({
                            status: 440,
                            result: "Fail",
                            message: "Session Expired. Please Login Again"
                        });
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 401,
            result: "Fail",
            message: "Unauthorized Activity"
        });
    }
}

module.exports = {
    verifyAdmin,
    verifyUser,
    verifyBoth
};
