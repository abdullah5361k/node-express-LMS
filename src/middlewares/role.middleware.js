const AppError = require("../utils/appError.util")

const roleOfUser = (role) => (req, res, next) => {
    if (role !== req.user.role) {
        return next(new AppError(400, `Only ${role} can access this page`))
    }
    next()
}

module.exports = roleOfUser