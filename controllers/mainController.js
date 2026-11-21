const User = require("../models/User");
const bcrypt = require("bcrypt");
const Mozi = require("../models/mozi");
const Film = require("../models/film");
const Hely = require("../models/hely");

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
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        req.session.message = "This user already exists!";
        return res.redirect("/register");
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: hash, role: "user" });
    req.session.message = "Successful registration! You can log in.";
    res.redirect("/login");
};

exports.loginGet = (req, res) => { res.render("login"); };
exports.loginPost = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        req.session.message = "Login failed!";
        return res.redirect("/login");
    }
    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
        req.session.message = "Login failed!";
        return res.redirect("/login");
    }
    req.session.user = { id: user._id, username: user.username, role: user.role }
}
exports.logout = (req, res) => {
    req.session.destroy(() => { res.redirect("/"); });
};

exports.diagram = (req, res) => { res.render("diagram"); };

exports.uzenetek = async (req, res) => {};