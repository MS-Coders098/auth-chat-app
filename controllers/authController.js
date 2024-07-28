const Users = require("../models/Users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.register = async function (req, res) {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Checking Validation
        if (!username || !email || !password || !confirmPassword) {
            req.flash("error", "All fields are requires")
            return res.redirect("/auth")
        }

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match")
            return res.redirect("/auth")
        }

        // Checking Email
        const user = await Users.findOne({ email: email })

        if (user) {
            req.flash("error", "Email already exists")
            return res.redirect("/auth")
        }

        // Hasing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new Users({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()
        req.flash("success", "User created successfully, Now Login")
        return res.redirect("/auth")

    } catch (error) {
        req.flash("error", "Something went wrong")
        return res.redirect("/auth")
    }
}

module.exports.login = async function (req, res) {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            req.flash("error", "All fields are requires")
            return res.redirect("/auth")
        }

        const user = await Users.findOne({ email: email })

        if (!user) {
            req.flash("error", "User not found")
            return res.redirect("/auth")
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            req.flash("error", "Incorrect password")
            return res.redirect("/auth")
        }

        const payload = {
            id: user._id
        }

        const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "15d" })
        req.session.encoded = token
        res.redirect("/")

    } catch (error) {
        req.flash("error", "Something wented wrong")
        return res.redirect("/auth")
    }
}

module.exports.logout = function (req, res) {
    try {
        delete req.session.encoded
        return res.redirect("/auth")
    } catch (error) {
        req.flash("error", "Something went wrong")
        return res.redirect("/auth")
    }
}