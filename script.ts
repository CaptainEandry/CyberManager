// nahrání dat z katalogu hrozeb
import { katalogHrozeb } from './data.js';
// Abstraktní třída pro bezpečnostní incidenty
abstract class SecurityIncident {
    constructor(protected id: string, protected name: string, protected baseRate: number) {}
    public abstract calculateTotalImpact(): number;
    public getName(): string { return this.name; }
}
// Třída pro technické incidenty např. DDOS
class TechnicalIncident extends SecurityIncident {
    constructor(id: string, name: string, baseRate: number, private downtime: number, private recovery: number) {
        super(id, name, baseRate);
    }
    public calculateTotalImpact(): number {
        return (this.downtime * this.baseRate) + this.recovery;
    }
}
// Třída pro incidenty úniku dat
class DataBreachIncident extends SecurityIncident {
    constructor(id: string, name: string, baseRate: number, private records: number, private penalty: number, private legal: number) {
        super(id, name, baseRate);
    }
    public calculateTotalImpact(): number {
        return (this.records * this.penalty) + this.legal;
    }
}
// Třída pro správu rizik a incidentů
class RiskRegistry {
    private incidents: SecurityIncident[] = [];
    public addIncident(incident: SecurityIncident) { this.incidents.push(incident); }
    public getTotalRisk(): number {
        return this.incidents.reduce((sum, inc) => sum + inc.calculateTotalImpact(), 0);
    }
    public getIncidents() { return this.incidents; }
}
// Test tříd a constructoru v konzoli
console.log("--- CyberRisk Simulator Inicializován ---");
const mujRegistr = new RiskRegistry();
// Přidání incidentub
const data1 = katalogHrozeb[0];
const ddos = new TechnicalIncident(data1.id, data1.nazev, data1.baseRate, 10, data1.recoveryCost!);
// Přidání incidentu
const data2 = katalogHrozeb[1];
const unik = new DataBreachIncident(data2.id, data2.nazev, data2.baseRate, 1000, data2.gdprPenalty!, data2.legalFees!);
// Přidání incidentů do registru
mujRegistr.addIncident(ddos);
mujRegistr.addIncident(unik);

// Výpis do konzole
console.log("Aktivní incidenty:", mujRegistr.getIncidents());
console.log("Celková škoda v korunách:", mujRegistr.getTotalRisk(), "Kč");