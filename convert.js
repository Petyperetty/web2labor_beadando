const fs = require('fs');
const path = require('path');

// Mezők, amelyeket számmá kell alakítani[cite: 5]
const szamMezok = ['moziazon', 'irszam', 'fkod', 'hossz'];

function konvertal(fajlNev) {
    const forrasUt = path.join(__dirname, 'data', `${fajlNev}.txt`);
    const celUt = path.join(__dirname, 'data', `${fajlNev}.json`);

    // Beolvasás UTF-8 kódolással, sorokra bontás és üres sorok szűrése
    const tartalom = fs.readFileSync(forrasUt, 'utf-8');
    const sorok = tartalom.split(/\r?\n/).filter(sor => sor.trim() !== '');

    // Fejléc (oszlopnevek) kinyerése az első sorból
    const fejlec = sorok[0].split('\t').map(oszlop => oszlop.trim());
    const adatok = [];

    // Adatsorok feldolgozása
    for (let i = 1; i < sorok.length; i++) {
        const ertekek = sorok[i].split('\t');
        const objektum = {};

        fejlec.forEach((kulcs, index) => {
            let ertek = ertekek[index] ? ertekek[index].trim() : '';

            if (kulcs === 'szines') {
                // -1 -> true, 0 -> false[cite: 5]
                objektum[kulcs] = ertek === '-1';
            } else if (szamMezok.includes(kulcs)) {
                // Szám típusú mezők átalakítása[cite: 5]
                objektum[kulcs] = Number(ertek);
            } else {
                // Szöveg típusú mezők[cite: 5]
                objektum[kulcs] = ertek;
            }
        });

        adatok.push(objektum);
    }

    // Mentés formázott JSON fájlként
    fs.writeFileSync(celUt, JSON.stringify(adatok, null, 2), 'utf-8');
    console.log(`Kész: ${fajlNev}.json (${adatok.length} rekord)`);
}

// A három tábla konvertálása[cite: 5]
konvertal('mozi');
konvertal('film');
konvertal('hely');