const Users = require("../models/Users")

module.exports.updateUser = async function (req, res) {
    try {

        if (!req.body.fullname) {
            req.flash("error", "All fields are required")
            return res.redirect("/")
        }

        const user = await Users.findOneAndUpdate({
            _id: req.user._id
        }, {
            fullname: req.body.fullname,
            profilePic: req.file.buffer
        },
            {
                new: true
            })

        if (!user) {
            req.flash("error", "Something went wrong")
            return res.redirect("/")
        }

        await user.save()
        req.flash("success", "Profile updated successfully")
        res.redirect("/")

    } catch (error) {
        req.flash("error", "Something went wrong")
        res.redirect("/")
    }
}