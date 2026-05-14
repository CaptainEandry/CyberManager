import { katalogHrozeb } from './data.js';

abstract class SecurityIncident {
    constructor(protected id: string, protected name: string, protected baseRate: number) {}
    public abstract calculateTotalImpact(): number;
    public getName(): string { return this.name; }
}

class TechnicalIncident extends SecurityIncident {
    constructor(id: string, name: string, baseRate: number, private downtime: number, private recovery: number) {
        super(id, name, baseRate);
    }
    public calculateTotalImpact(): number {
        return (this.downtime * this.baseRate) + this.recovery;
    }
}

class DataBreachIncident extends SecurityIncident {
    constructor(id: string, name: string, baseRate: number, private records: number, private penalty: number, private legal: number) {
        super(id, name, baseRate);
    }
    public calculateTotalImpact(): number {
        return (this.records * this.penalty) + this.legal;
    }
}

class RiskRegistry {
    private incidents: SecurityIncident[] = [];
    public addIncident(incident: SecurityIncident) { this.incidents.push(incident); }
    public getTotalRisk(): number {
        return this.incidents.reduce((sum, inc) => sum + inc.calculateTotalImpact(), 0);
    }
    public getIncidents() { return this.incidents; }
}
