const Film = require("../models/film");

exports.lista = async (req, res) => {
    const filmek = await Film.find().sort({ fkod: 1 });
    res.render("crud", { filmek });
};