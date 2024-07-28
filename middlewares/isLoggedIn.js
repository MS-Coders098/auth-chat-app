const Users = require("../models/Users");
const jwt = require("jsonwebtoken")

async function isLoggedIn(req, res, next) {
    try {

        if (!req.session.encoded) {
            req.flash("error", "you need to login first")
            return res.redirect("/auth")
        }

        const decoded = jwt.verify(req.session.encoded, process.env.JWT_TOKEN)
        if (!decoded) {
            req.flash("error", "you need to login first")
            return res.redirect("/auth")
        }

        const user = await Users.findOne({ _id: decoded.id }).select("-password")
        if (!user) {
            req.flash("error", "you need to login first")
            return res.redirect("/auth")
        }

        req.user = user
        next()

    } catch (error) { 
        req.flash("error", "Something went wrong")
        return res.redirect("/auth")
    }
}

module.exports = isLoggedIn