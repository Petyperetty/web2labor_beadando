const User = require("../models/user");
const bcrypt = require("bcrypt");
const Mozi = require("../models/mozi");
const Film = require("../models/film");
const Hely = require("../models/hely");
const Uzenet = require("../models/uzenet");

exports.homeIndex = (req, res) => { res.render("home"); };

exports.allMozi = async (req, res) => {
    const allMozik = await Mozi.find({});
    console.log(allMozik);
    return res.render("mozik", {allMozik});
};

exports.allFilm = async (req, res) => {
    const moziazon = req.params.moziazon;
    console.log(moziazon);
    const hely = await Hely.find({moziazon});
    console.log(hely);
    const filmKodok = hely.map( (filmek) => filmek.fkod );
    console.log(filmKodok);
    const filmek = await Film.find({fkod:{$in:filmKodok}}); 
    console.log(filmek);
    return res.render("filmek", {filmek});
};

exports.registerGet = (req, res) => { res.render("register"); };
exports.registerPost = async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        req.session.message = "Már létező email cím!";
        return res.redirect("/register");
    }
    const existingName = await User.findOne({ username: req.body.username });
    if (existingName) {
        req.session.message = "Már létező felhasználónév!";
        return res.redirect("/register");
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const save = await User.create({ username: req.body.username, password: hash, role: "user", email: req.body.email });
    
    if (!save) {
        req.session.message = "Sikertelen regisztráció!";
        return res.redirect("/register");
    }
    req.session.user = { username: save.username, role: save.role }
    req.session.message = "Sikeres regisztráció!";
    res.redirect("/");
};

exports.loginGet = (req, res) => { res.render("login"); };
exports.loginPost = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.session.message = "Hibás email!";
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
        req.session.message = "Hibás jelszó!";
        return res.redirect("/login");
    }
    req.session.user = { username: user.username, role: user.role }
    req.session.message = "Sikeres bejelentkezés!";
    res.redirect("/");
}
exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/"); });
};

exports.diagram = (req, res) => { res.render("diagram"); };