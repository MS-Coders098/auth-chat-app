const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
    let err = req.flash("error")
    let suc = req.flash("success")
    let latestSuc = suc.pop()
    let latestterr = err.pop()
    res.render("auth", {error: latestterr, success: latestSuc})  
})

router.post('/api/register', register)

router.post('/api/login', login)

router.get("/api/logout", logout)

module.exports = router;