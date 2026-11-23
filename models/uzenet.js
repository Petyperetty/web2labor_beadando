const mongoose = require("mongoose");
const uzenetSchema = new mongoose.Schema({
nev:{
        type: String,
        required: [true, "A név megadása kötelező!"],
        minlength: [3, "A név legalább 3 karakter legyen!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Az email cím megadása kötelező!"],
        minlength: [5, "Érvényes e-mail címet adj meg!"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Érvényes e-mail címet adj meg!"],
    trim: true
    },
    targy: {
        type: String,
        required: [true, "A tárgy megadása kötelező!"],
        minlength: [3, "A tárgy legalább 3 karakter legyen!"],
        trim: true
    },
    uzenet: {
        type: String,
        required: [true, "Az üzenet megadása kötelező!"],
        minlength: [5, "Az üzenetnek legalább 5 karakter hosszúnak kell lennie!"],
        trim: true
    }
}, { timestamps: true });
module.exports = mongoose.model("uzenet", uzenetSchema, "uzenet");