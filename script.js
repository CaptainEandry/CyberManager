import { katalogHrozeb } from './data.js';

class BezpecnostniIncident {
    idInstance;
    nazev;
    zakladniSazba;
    constructor(nazev, zakladniSazba) {
        this.nazev = nazev;
        this.zakladniSazba = zakladniSazba;
        this.idInstance = "id-" + Math.random().toString();
    }
}

class TechnickyIncident extends BezpecnostniIncident { 
    nakladyNaObnovu;
    constructor(nazev, zakladniSazba, nakladyNaObnovu) {
        super(nazev, zakladniSazba);
        this.nakladyNaObnovu = nakladyNaObnovu;
    }
    spocitejCelkovouSkodu() {
        return this.zakladniSazba + this.nakladyNaObnovu;
    }
    ziskejDalsiNaklady() {
        return this.nakladyNaObnovu;
    }
}

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

class RegistrRizik {
    incidenty = [];
    pridejIncident(incident) {
        this.incidenty.push(incident);
    }
    smazIncident(idInstance) {
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

document.addEventListener('DOMContentLoaded', function () {
    let registr = new RegistrRizik();
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
    function prekresliTabulku() {
        tabulkaRizikEl.innerHTML = '';
        for (let i = 0; i < registr.incidenty.length; i++) {
            let incident = registr.incidenty[i];
            let radek = document.createElement('tr');
            radek.innerHTML = `
                <td>${incident.nazev}</td>
                <td>${incident.zakladniSazba} Kč</td>
                <td>${incident.ziskejDalsiNaklady()} Kč</td>
                <td>${incident.spocitejCelkovouSkodu()} Kč</td>
                <td><button class="btn-delete" data-id="${incident.idInstance}">Smazat</button></td>
            `;
            tabulkaRizikEl.appendChild(radek);
        }
        celkovaSkodaEl.innerText = registr.spocitejCelkoveRiziko().toString();
        let tlacitkaSmazat = document.getElementsByClassName('btn-delete');
        for (let i = 0; i < tlacitkaSmazat.length; i++) {
            tlacitkaSmazat[i].addEventListener('click', function (udalost) {
                let tlacitko = udalost.target;
                let idKeSmazani = tlacitko.getAttribute('data-id');
                if (idKeSmazani !== null) {
                    registr.smazIncident(idKeSmazani);
                    prekresliTabulku();
                }
            });
        }
    }
    for (let i = 0; i < katalogHrozeb.length; i++) {
        let hrozba = katalogHrozeb[i];
        let polozkaDiv = document.createElement('div');
        polozkaDiv.className = 'threat-item';
        let tlacitkoPridat = document.createElement('button');
        tlacitkoPridat.className = 'btn-attack';
        tlacitkoPridat.innerText = hrozba.nazev;
        tlacitkoPridat.addEventListener('click', function () {
            let novyIncident;
            if (hrozba.typ === 'technicky') {
                novyIncident = new TechnickyIncident(hrozba.nazev, hrozba.zakladniSazba, hrozba.dalsiNaklady);
            }
            else {
                novyIncident = new UnikDatIncident(hrozba.nazev, hrozba.zakladniSazba, hrozba.dalsiNaklady);
            }
            registr.pridejIncident(novyIncident);
            prekresliTabulku();
        });

        let tlacitkoUpravit = document.createElement('button');
        tlacitkoUpravit.className = 'btn-ghost';
        tlacitkoUpravit.innerText = 'Upravit';
        tlacitkoUpravit.addEventListener('click', function () {
            document.getElementById('edit-id').value = hrozba.id;
            document.getElementById('edit-typ').value = hrozba.typ;
            document.getElementById('edit-modal-title').innerText = "Upravit: " + hrozba.nazev;
            document.getElementById('edit-base-rate').value = hrozba.zakladniSazba.toString();
            document.getElementById('edit-other-costs').value = hrozba.dalsiNaklady.toString();
            oknoUpravit.style.display = 'block'; // Zobrazíme modální okno
        });
        polozkaDiv.appendChild(tlacitkoPridat);
        polozkaDiv.appendChild(tlacitkoUpravit);
        seznamHrozebEl.appendChild(polozkaDiv);
    }

    formularUpravit.addEventListener('submit', function (udalost) {
        udalost.preventDefault(); 
        let idHrozby = document.getElementById('edit-id').value;
        let typHrozby = document.getElementById('edit-typ').value;
        let zakladniSazba = Number(document.getElementById('edit-base-rate').value);
        let dalsiNaklady = Number(document.getElementById('edit-other-costs').value);
        let nazevHrozby = "";
        for (let i = 0; i < katalogHrozeb.length; i++) {
            if (katalogHrozeb[i].id === idHrozby) {
                nazevHrozby = katalogHrozeb[i].nazev;
            }
        }
        let upravenyIncident;
        if (typHrozby === 'technicky') {
            upravenyIncident = new TechnickyIncident(nazevHrozby + " (Upraveno)", zakladniSazba, dalsiNaklady);
        }
        else {
            upravenyIncident = new UnikDatIncident(nazevHrozby + " (Upraveno)", zakladniSazba, dalsiNaklady);
        }
        registr.pridejIncident(upravenyIncident);
        prekresliTabulku();
        oknoUpravit.style.display = 'none';
    });
    tlacitkoVlastniUtok.addEventListener('click', function () {
        formularPridat.reset(); 
        oknoPridat.style.display = 'block';
    });

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
    tlacitkoZavritUpravit.addEventListener('click', function () {
        oknoUpravit.style.display = 'none';
    });
    tlacitkoZavritPridat.addEventListener('click', function () {
        oknoPridat.style.display = 'none';
    });
    window.addEventListener('click', function (udalost) {
        if (udalost.target === oknoUpravit) {
            oknoUpravit.style.display = 'none';
        }
        if (udalost.target === oknoPridat) {
            oknoPridat.style.display = 'none';
        }
    });
});