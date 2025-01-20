const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/CatchAsync");
const passport  = require("passport");
const { isLoggedIn } = require("../middleware.js");

router.get("/register",(req,res) => {
    res.render("users/register");
})

router.post("/register",catchAsync(async (req,res,next) => {
try{
    const { email, username, password } = req.body;
    const user = new User ({ email,username });
    const registeredUser = await User.register(user,password);
    // console.log(registeredUser);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success","Welcome to yelp camp");
        res.redirect("/campgrounds");
    })
} catch(e){
    req.flash("error",e.message);
    res.redirect("register");
}
    // res.send(req.body);
}))
let redirectUrl = 0;
router.get("/login",(req,res) => {
    // console.log("Return to URL in get route for login: ",req.session.returnTo);
    redirectUrl = req.session.returnTo;
    res.render("users/login");
})

router.post("/login",passport.authenticate("local",{failureFlash: true, failureRedirect:"/login"}),(req,res) => {
    req.flash("success", "Welcome back");
    // console.log("Return to URL in the login post route: ",req.session.returnTo);
    // const redirectUrl = req.session.returnTo || "/campgrounds";
    // delete req.session.returnTo;
    res.redirect(redirectUrl || "/campgrounds");
})

// router.get("/logout",(req,res) => {
//     req.logout();
//     req.flash("success","Good Bye");
//     res.redirect("/campgrounds");
// })

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Good Bye");
        res.redirect("/campgrounds");
    });
});


module.exports = router;