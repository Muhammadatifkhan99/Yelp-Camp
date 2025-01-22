const User = require("../models/user");


module.exports.registerationForm = (req,res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req,res,next) => {
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
}
let redirectUrl = 0;
module.exports.renderLogin = (req,res) => {
    // console.log("Return to URL in get route for login: ",req.session.returnTo);
    redirectUrl = req.session.returnTo;
    res.render("users/login");
}

module.exports.login = (req,res) => {
    req.flash("success", "Welcome back");
    // console.log("Return to URL in the login post route: ",req.session.returnTo);
    // const redirectUrl = req.session.returnTo || "/campgrounds";
    // delete req.session.returnTo;
    res.redirect(redirectUrl || "/campgrounds");
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Good Bye");
        res.redirect("/campgrounds");
    });
}