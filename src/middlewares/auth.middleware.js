const AppError = require("../utils/appError.util")
const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    const cookieToken = req.cookies.token;
    if (!cookieToken) {
        return next(new AppError(401, "Unaothorized"))
    }

    jwt.verify(cookieToken, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            return next(new AppError(401, err.message || "Token is expired"))
        }
        req.user = decoded
        next()
    })

}

module.exports = authentication