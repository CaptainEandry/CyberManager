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
