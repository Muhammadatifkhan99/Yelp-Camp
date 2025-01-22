const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/CatchAsync");
const passport  = require("passport");
const { isLoggedIn } = require("../middleware.js");
const users = require("../controllers/users.js");

router.route("/register")
    .get(users.registerationForm)
    .post(catchAsync(users.registerUser))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local",{failureFlash: true, failureRedirect:"/login"}),users.login)

// router.get("/logout",(req,res) => {
//     req.logout();
//     req.flash("success","Good Bye");
//     res.redirect("/campgrounds");
// })

router.get("/logout", users.logout);


module.exports = router;