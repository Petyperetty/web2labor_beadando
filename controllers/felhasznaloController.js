const User = require("../models/User");

exports.lista = async (req, res) => {
    const felhasznalok = await User.find().select("-password").sort({ username: 1 });
    res.render("felhasznalok", { felhasznalok });
};

exports.szerepkorValtas = async (req, res) => {
    try {
        const f = await User.findById(req.params.id);
        if (!f) {
            req.session.message = "A felhasználó nem található.";
        } else if (f.username === req.session.user.username) {
            req.session.message = "A saját szerepkörödet nem módosíthatod!";
        } else {
            f.role = f.role === "admin" ? "user" : "admin";
            await f.save();
            req.session.message = `${f.username} új szerepköre: ${f.role}.`;
        }
    } catch (err) {
        console.error(err);
        req.session.message = "Nem sikerült módosítani a szerepkört.";
    }
    res.redirect("/felhasznalok");
};
exports.torles = async (req, res) => {
    try {
        const f = await User.findById(req.params.id);
        if (!f) {
            req.session.message = "A felhasználó nem található.";
        } else if (f.username === req.session.user.username) {
            req.session.message = "Saját magadat nem törölheted!";
        } else {
           await f.deleteOne();
           req.session.message = `${f.username} törölve.`;
        }
    } catch (err) {
        console.error(err);
        req.session.message = "Nem sikerült törölni a felhasználót.";
    }
    res.redirect("/felhasznalok");
};