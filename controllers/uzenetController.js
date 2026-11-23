const Uzenet = require("../models/uzenet");

exports.kapcsolatGet = (req, res) => {
    res.render("kapcsolat", { adatok: {}, hibak: {} });
};

exports.kapcsolatPost = async (req, res) => {
    try {
        await Uzenet.create({
            nev: req.body.nev,
            email: req.body.email,
            targy: req.body.targy,
            uzenet: req.body.uzenet,
        });
        req.session.message = "Az üzenet elküldésre került!";
        res.redirect("/kapcsolat");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.render("kapcsolat", {
                adatok: req.body,
                hibak: err.errors,
                message: "Sikertelen küldés!"
            });
        }
        console.error(err);
        req.session.message = "Hiba történt, próbáld újra később!";
        res.redirect("/kapcsolat");
    }
};
exports.uzenetekGet = async (req, res) => {
    const uzenetek = await Uzenet.find().sort({ createdAt: -1 });
    res.render("uzenetek", { uzenetek });
};