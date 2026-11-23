// a tanári 07b mintából (routes/mainRouter.js)
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) { return next(); }
    req.session.message = "Kérjük jelentkezz be!";
    res.redirect("/login");
}

exports.isAdmin = (req, res, next) => {
    if (req.session.user &&
        req.session.user.role === "admin") {
        return next();
    }
    req.session.message = "Adminisztrációs jogosultság szükséges!";
    res.redirect("/");
}