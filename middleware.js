module.exports.isLoggedIn = (req,res,next) => {
    console.log("REQ.USER...",req.user);
    if(!req.isAuthenticated()){
        req.flash("error","you must sign in");
        return res.redirect("/login");
    }
    next();
}