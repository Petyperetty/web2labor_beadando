const Film = require("../models/film");
const Hely = require("../models/hely");
const Mozi = require("../models/mozi");

async function listak() {
    const rendez = (t) => t.filter(x => x).sort((a, b) => a.localeCompare(b, "hu"));
    return {
        mufajok: rendez(await Film.distinct("mufaj")),
        szarmazasok: rendez(await Film.distinct("szarmazas")),
        mozik: (await Mozi.find()).sort((a, b) => a.mozinev.localeCompare(b.mozinev, "hu"))
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
        szines: req.body.szines === "on",
        moziazon: parseInt(req.body.moziazon)
    };
    try {
        const mozi = adatok.moziazon ? await Mozi.findOne({ moziazon: adatok.moziazon }) : null;

        const film = new Film(adatok);
        const ellenorzes = film.validateSync();
        const hibak = ellenorzes ? ellenorzes.errors : {};
        if (!mozi) {
            hibak.moziazon = { message: "Válaszd ki, melyik moziban vetítik!" };
        }
        if (Object.keys(hibak).length > 0) {
            return res.render("crud_urlap", {
                cim: "Új film hozzáadása", action: "/crud/uj",
                adatok, hibak, message: "Sikertelen mentés!", ...(await listak())
            });
        }

        const utolso = await Film.findOne().sort({ fkod: -1 });
        film.fkod = utolso ? utolso.fkod + 1 : 1;
        await film.save();
        await Hely.create({
            fkod: film.fkod,
            moziazon: mozi.moziazon
        });

        req.session.message = `A film hozzáadva, vetíti: ${mozi.mozinev}.`;
        res.redirect("/crud");
    } catch (err) {
        console.error(err);
        req.session.message = "Hiba történt, próbáld újra később!";
        res.redirect("/crud");
    }
};
exports.szerkesztGet = async (req, res) => {
    try {
        const film = await Film.findById(req.params.id);
        if (!film) {
            req.session.message = "A film nem található.";
            return res.redirect("/crud");
        }
        res.render("crud_urlap", {
            cim: "Film szerkesztése", action: `/crud/${film._id}/szerkeszt`,
            adatok: film, hibak: {}, ...(await listak())
        });
    } catch (err) {
        console.error(err);
        req.session.message = "A film nem található.";
        res.redirect("/crud");
    }
};

exports.szerkesztPost = async (req, res) => {
    const adatok = {
        filmcim: req.body.filmcim,
        mufaj: req.body.mufaj,
        szarmazas: req.body.szarmazas,
        hossz: req.body.hossz,
        szinkron: req.body.szinkron,
        szines: req.body.szines === "on"
    };
    try {
        const film = await Film.findById(req.params.id);
        if (!film) {
            req.session.message = "A film nem található.";
            return res.redirect("/crud");
        }
        film.set(adatok);
        await film.save();
        req.session.message = "A film módosítva.";
        res.redirect("/crud");
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.render("crud_urlap", {
                cim: "Film szerkesztése", action: `/crud/${req.params.id}/szerkeszt`,
                adatok, hibak: err.errors, message: "Sikertelen mentés!", ...(await listak())
            });
        }
        console.error(err);
        req.session.message = "Hiba történt, próbáld újra később!";
        res.redirect("/crud");
    }
};

exports.torles = async (req, res) => {
    try {
        const film = await Film.findByIdAndDelete(req.params.id);
        if (film) {
            await Hely.deleteMany({ fkod: film.fkod });
            req.session.message = `A(z) „${film.filmcim}” film törölve.`;
        } else {
            req.session.message = "A film nem található.";
        }
    } catch (err) {
        console.error(err);
        req.session.message = "Nem sikerült törölni a filmet.";
    }
    res.redirect("/crud");
};