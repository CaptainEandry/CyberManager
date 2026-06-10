import { katalogHrozeb } from './data.js';
// Abstraktní třída je jako šablona. Nemůžeme z ní vytvořit objekt přímo,
// ale ostatní třídy z ní mohou dědit (převzít její vlastnosti a metody).
class BezpecnostniIncident {
    idInstance; // Unikátní ID pro mazání z tabulky
    nazev;
    zakladniSazba;
    constructor(nazev, zakladniSazba) {
        this.nazev = nazev;
        this.zakladniSazba = zakladniSazba;
        // Vygenerujeme náhodné ID pro tento konkrétní záznam
        this.idInstance = "id-" + Math.random().toString();
    }
}
// Třída pro technické útoky (např. DDoS, Ransomware)
class TechnickyIncident extends BezpecnostniIncident {
    nakladyNaObnovu;
    constructor(nazev, zakladniSazba, nakladyNaObnovu) {
        super(nazev, zakladniSazba); // Voláme konstruktor rodiče (BezpecnostniIncident)
        this.nakladyNaObnovu = nakladyNaObnovu;
    }
    spocitejCelkovouSkodu() {
        return this.zakladniSazba + this.nakladyNaObnovu;
    }
    ziskejDalsiNaklady() {
        return this.nakladyNaObnovu;
    }
}
// Třída pro úniky dat (např. Krádež hesel)
class UnikDatIncident extends BezpecnostniIncident {
    pokutyAPoplatky;
    constructor(nazev, zakladniSazba, pokutyAPoplatky) {
        super(nazev, zakladniSazba);
        this.pokutyAPoplatky = pokutyAPoplatky;
    }
    spocitejCelkovouSkodu() {
        return this.zakladniSazba + this.pokutyAPoplatky;
    }
    ziskejDalsiNaklady() {
        return this.pokutyAPoplatky;
    }
}
// Třída pro vlastní útoky vytvořené uživatelem přes formulář
class VlastniIncident extends BezpecnostniIncident {
    vlastniNaklady;
    constructor(nazev, zakladniSazba, vlastniNaklady) {
        super(nazev, zakladniSazba);
        this.vlastniNaklady = vlastniNaklady;
    }
    spocitejCelkovouSkodu() {
        return this.zakladniSazba + this.vlastniNaklady;
    }
    ziskejDalsiNaklady() {
        return this.vlastniNaklady;
    }
}
// --- 2. TŘÍDA PRO SPRÁVU (Ukládání dat aplikace) ---
class RegistrRizik {
    incidenty = [];
    pridejIncident(incident) {
        this.incidenty.push(incident);
    }
    smazIncident(idInstance) {
        // Vytvoříme nové prázdné pole a zkopírujeme do něj vše kromě toho, co chceme smazat
        let novePole = [];
        for (let i = 0; i < this.incidenty.length; i++) {
            if (this.incidenty[i].idInstance !== idInstance) {
                novePole.push(this.incidenty[i]);
            }
        }
        this.incidenty = novePole;
    }
    spocitejCelkoveRiziko() {
        let celkem = 0;
        for (let i = 0; i < this.incidenty.length; i++) {
            celkem = celkem + this.incidenty[i].spocitejCelkovouSkodu();
        }
        return celkem;
    }
}
// --- 3. PROPOJENÍ S HTML STRÁNKOU (DOM) ---
// Kód uvnitř se spustí až ve chvíli, kdy je celá HTML stránka načtená
document.addEventListener('DOMContentLoaded', function () {
    let registr = new RegistrRizik();
    // Získání HTML elementů - používáme klasické přiřazení pro lepší čitelnost
    let seznamHrozebEl = document.getElementById('threat-list');
    let tabulkaRizikEl = document.getElementById('risk-tbody');
    let celkovaSkodaEl = document.getElementById('total-risk-value');
    let oknoUpravit = document.getElementById('edit-modal');
    let oknoPridat = document.getElementById('add-modal');
    let tlacitkoZavritUpravit = document.getElementById('close-edit');
    let tlacitkoZavritPridat = document.getElementById('close-add');
    let formularUpravit = document.getElementById('edit-form');
    let formularPridat = document.getElementById('add-form');
    let tlacitkoVlastniUtok = document.getElementById('btn-add-custom');
    // Funkce pro překreslení tabulky
    function prekresliTabulku() {
        // Vyčistíme tabulku
        tabulkaRizikEl.innerHTML = '';
        // Projdeme všechny uložené incidenty a vytvoříme pro ně HTML řádky
        for (let i = 0; i < registr.incidenty.length; i++) {
            let incident = registr.incidenty[i];
            let radek = document.createElement('tr');
            // Polymorfismus v akci: zavoláme ziskejDalsiNaklady() a spocitejCelkovouSkodu() 
            // a nestaráme se o to, jaká přesně je to podřízená třída. Každá ví, co má dělat.
            radek.innerHTML = `
                <td>${incident.nazev}</td>
                <td>${incident.zakladniSazba} Kč</td>
                <td>${incident.ziskejDalsiNaklady()} Kč</td>
                <td>${incident.spocitejCelkovouSkodu()} Kč</td>
                <td><button class="btn-delete" data-id="${incident.idInstance}">Smazat</button></td>
            `;
            tabulkaRizikEl.appendChild(radek);
        }
        // Aktualizujeme celkový součet dole pod tabulkou
        celkovaSkodaEl.innerText = registr.spocitejCelkoveRiziko().toString();
        // Po vytvoření řádků musíme znovu oživit všechna nová tlačítka "Smazat"
        let tlacitkaSmazat = document.getElementsByClassName('btn-delete');
        for (let i = 0; i < tlacitkaSmazat.length; i++) {
            tlacitkaSmazat[i].addEventListener('click', function (udalost) {
                let tlacitko = udalost.target;
                let idKeSmazani = tlacitko.getAttribute('data-id');
                if (idKeSmazani !== null) {
                    registr.smazIncident(idKeSmazani);
                    prekresliTabulku(); // Překreslíme, aby změna byla vidět i na webu
                }
            });
        }
    }
    // --- 4. DYNAMICKÉ GENEROVÁNÍ KATALOGU HROZEB Z DATA.TS ---
    for (let i = 0; i < katalogHrozeb.length; i++) {
        let hrozba = katalogHrozeb[i];
        // Vytvoříme obalovací div (rámeček pro tlačítka)
        let polozkaDiv = document.createElement('div');
        polozkaDiv.className = 'threat-item';
        // Vytvoříme levé červené tlačítko pro rychlé přidání útoku
        let tlacitkoPridat = document.createElement('button');
        tlacitkoPridat.className = 'btn-attack';
        tlacitkoPridat.innerText = hrozba.nazev;
        // Co se stane při kliknutí na název útoku
        tlacitkoPridat.addEventListener('click', function () {
            let novyIncident;
            // Podle typu hrozby vytvoříme správný objekt
            if (hrozba.typ === 'technicky') {
                novyIncident = new TechnickyIncident(hrozba.nazev, hrozba.zakladniSazba, hrozba.dalsiNaklady);
            }
            else {
                novyIncident = new UnikDatIncident(hrozba.nazev, hrozba.zakladniSazba, hrozba.dalsiNaklady);
            }
            registr.pridejIncident(novyIncident);
            prekresliTabulku();
        });
        // Vytvoříme pravé průhledné tlačítko pro úpravu
        let tlacitkoUpravit = document.createElement('button');
        tlacitkoUpravit.className = 'btn-ghost';
        tlacitkoUpravit.innerText = 'Upravit';
        // Co se stane při kliknutí na Upravit
        tlacitkoUpravit.addEventListener('click', function () {
            // Do skrytých políček (type="hidden") si uložíme typ a ID, 
            // abychom po uložení věděli, o jaký útok se jednalo
            document.getElementById('edit-id').value = hrozba.id;
            document.getElementById('edit-typ').value = hrozba.typ;
            // Předvyplníme viditelná políčka z dat
            document.getElementById('edit-modal-title').innerText = "Upravit: " + hrozba.nazev;
            document.getElementById('edit-base-rate').value = hrozba.zakladniSazba.toString();
            document.getElementById('edit-other-costs').value = hrozba.dalsiNaklady.toString();
            oknoUpravit.style.display = 'block'; // Zobrazíme modální okno
        });
        // Přidáme obě tlačítka do našeho div rámečku a ten vložíme do levého panelu
        polozkaDiv.appendChild(tlacitkoPridat);
        polozkaDiv.appendChild(tlacitkoUpravit);
        seznamHrozebEl.appendChild(polozkaDiv);
    }
    // --- 5. OBSLUHA FORMULÁŘŮ (ULOŽENÍ ÚPRAV A NOVÉHO ÚTOKU) ---
    // Odeslání formuláře pro upravený útok
    formularUpravit.addEventListener('submit', function (udalost) {
        udalost.preventDefault(); // Zabránit znovunačtení stránky po kliknutí na Uložit
        // Načteme hodnoty z inputů (pomocí Number převedeme text z inputu na číslo)
        let idHrozby = document.getElementById('edit-id').value;
        let typHrozby = document.getElementById('edit-typ').value;
        let zakladniSazba = Number(document.getElementById('edit-base-rate').value);
        let dalsiNaklady = Number(document.getElementById('edit-other-costs').value);
        // Pomocí FOR cyklu najdeme původní název hrozby v kataloguHrozeb
        let nazevHrozby = "";
        for (let i = 0; i < katalogHrozeb.length; i++) {
            if (katalogHrozeb[i].id === idHrozby) {
                nazevHrozby = katalogHrozeb[i].nazev;
            }
        }
        let upravenyIncident;
        // Vytvoříme objekt podle typu
        if (typHrozby === 'technicky') {
            upravenyIncident = new TechnickyIncident(nazevHrozby + " (Upraveno)", zakladniSazba, dalsiNaklady);
        }
        else {
            upravenyIncident = new UnikDatIncident(nazevHrozby + " (Upraveno)", zakladniSazba, dalsiNaklady);
        }
        registr.pridejIncident(upravenyIncident);
        prekresliTabulku();
        oknoUpravit.style.display = 'none'; // Zavřeme okno
    });
    // Otevření okna pro úplně jiný vlastní útok
    tlacitkoVlastniUtok.addEventListener('click', function () {
        formularPridat.reset(); // Promaže hodnoty z předchozího psaní
        oknoPridat.style.display = 'block';
    });
    // Odeslání formuláře pro vlastní útok
    formularPridat.addEventListener('submit', function (udalost) {
        udalost.preventDefault();
        let nazev = document.getElementById('add-name').value;
        let zakladniSazba = Number(document.getElementById('add-base-rate').value);
        let dalsiNaklady = Number(document.getElementById('add-other-costs').value);
        let vlastniIncident = new VlastniIncident(nazev, zakladniSazba, dalsiNaklady);
        registr.pridejIncident(vlastniIncident);
        prekresliTabulku();
        oknoPridat.style.display = 'none';
    });
    // --- 6. LOGIKA PRO ZAVÍRÁNÍ MODÁLNÍCH OKEN ---
    // Zavírání oken pomocí křížků
    tlacitkoZavritUpravit.addEventListener('click', function () {
        oknoUpravit.style.display = 'none';
    });
    tlacitkoZavritPridat.addEventListener('click', function () {
        oknoPridat.style.display = 'none';
    });
    // Zavření oken kliknutím myši mimo ně (na tmavé pozadí kolem)
    window.addEventListener('click', function (udalost) {
        if (udalost.target === oknoUpravit) {
            oknoUpravit.style.display = 'none';
        }
        if (udalost.target === oknoPridat) {
            oknoPridat.style.display = 'none';
        }
    });
});
