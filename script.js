import { katalogHrozeb } from './data.js';
class SecurityIncident {
    id;
    name;
    baseRate;
    constructor(id, name, baseRate) {
        this.id = id;
        this.name = name;
        this.baseRate = baseRate;
    }
    getName() { return this.name; }
}
class TechnicalIncident extends SecurityIncident {
    downtime;
    recovery;
    constructor(id, name, baseRate, downtime, recovery) {
        super(id, name, baseRate);
        this.downtime = downtime;
        this.recovery = recovery;
    }
    calculateTotalImpact() {
        return (this.downtime * this.baseRate) + this.recovery;
    }
}
class DataBreachIncident extends SecurityIncident {
    records;
    penalty;
    legal;
    constructor(id, name, baseRate, records, penalty, legal) {
        super(id, name, baseRate);
        this.records = records;
        this.penalty = penalty;
        this.legal = legal;
    }
    calculateTotalImpact() {
        return (this.records * this.penalty) + this.legal;
    }
}
class RiskRegistry {
    incidents = [];
    addIncident(incident) { this.incidents.push(incident); }
    getTotalRisk() {
        return this.incidents.reduce((sum, inc) => sum + inc.calculateTotalImpact(), 0);
    }
    getIncidents() { return this.incidents; }
}
// Test tříd a constructoru v konzoli
console.log("--- CyberRisk Simulator Inicializován ---");
const mujRegistr = new RiskRegistry();
const data1 = katalogHrozeb[0];
const ddos = new TechnicalIncident(data1.id, data1.nazev, data1.baseRate, 10, data1.recoveryCost);
const data2 = katalogHrozeb[1];
const unik = new DataBreachIncident(data2.id, data2.nazev, data2.baseRate, 1000, data2.gdprPenalty, data2.legalFees);
mujRegistr.addIncident(ddos);
mujRegistr.addIncident(unik);
// Výpis do konzole
console.log("Aktivní incidenty:", mujRegistr.getIncidents());
console.log("Celková škoda v korunách:", mujRegistr.getTotalRisk(), "Kč");
