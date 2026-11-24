const Film = require("../models/film");

async function listak() {
    const rendez = (t) => t.filter(x => x).sort((a, b) => a.localeCompare(b, "hu"));
    return {
        mufajok: rendez(await Film.distinct("mufaj")),
        szarmazasok: rendez(await Film.distinct("szarmazas"))
    };
}

exports.lista = async (req, res) => {
    const q = (req.query.q || "").trim();
    const mufaj = req.query.mufaj || "";

    const szuro = {};
    if (q) {
        const biztonsagos = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        szuro.filmcim = { $regex: biztonsagos, $options: "i" };
    }
    if (mufaj) {
        szuro.mufaj = mufaj;
    }

    const filmek = await Film.find(szuro).sort({ fkod: 1 });
    const mufajok = (await Film.distinct("mufaj")).filter(m => m).sort((a, b) => a.localeCompare(b, "hu"));
    res.render("crud", { filmek, mufajok, q, mufaj,  });
};
exports.ujGet =  async (req, res) => {
    res.render("crud_urlap", { cim: "Új film hozzáadása", action: "/crud/uj", adatok: {}, hibak: {}, ...(await listak()) });
};

exports.ujPost = async (req, res) => {
    const adatok = {
        filmcim: req.body.filmcim,
        mufaj: req.body.mufaj,
        szarmazas: req.body.szarmazas,
        hossz: req.body.hossz,
        szinkron: req.body.szinkron,
        szines: req.body.szines === "on"
    };
    try {
        const utolso = await Film.findOne().sort({ fkod: -1 });
        adatok.fkod = utolso ? utolso.fkod + 1 : 1;
        await Film.create(adatok);
        req.session.message = "A film hozzáadva.";
        res.redirect("/crud");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.render("crud_urlap", {
                cim: "Új film hozzáadása", action: "/crud/uj",
                adatok, hibak: err.errors, message: "Sikertelen mentés!", ...(await listak())
            });
        }
        console.error(err);
        req.session.message = "Hiba történt, próbáld újra később!";
        res.redirect("/crud");
    }
};