const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const upload = require('../config/multer-config');
const { updateUser } = require('../controllers/updateUser');
const Users = require('../models/Users');

router.get('/', isLoggedIn, async (req, res) => {
    const user = await Users.findOne({ _id: req.user._id })
    delete req.flash("error")
    res.render("index", { user })
})

router.get("/chat", isLoggedIn, function (req, res) {
    res.render("chat", {user: req.user})
})

router.post("/api/updateuser", isLoggedIn, upload.single("profilePic"), updateUser)

module.exports = router;