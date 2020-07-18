import { Injectable } from '@angular/core';
import { RiskGraphService } from './risk-graph.service';
import { Graph } from './graph';
import { getRiskValue } from './risk';
import { nameToCssColour } from './colours';

export class Risk {
    category : string;
    risk : number;
    earliest : Date;
    latest : Date;

    colourName() : string {
        return nameToCssColour(this.category, "category");
    }

};

export class Target {

    id : string;
    risks : Risk[];

    getRiskScore() : number {

        let score = 1;

        for (let risk of this.risks) {
            score *= (1 - risk.risk);
        }

        return 1 - score;

    }

    applyWindow(start : Date, end : Date) : Target {

        let tgt = new Target();
        tgt.id = this.id;
        tgt.risks = [];
        for (let r of this.risks) {
	    
            if (r.earliest > end) continue;
            if (r.latest < start) continue;

            let wr = new Risk();

            wr.category = r.category;

            if (r.earliest >= start)
                wr.earliest = r.earliest;
            else
                wr.earliest = start;

            if (r.latest <= end)
                wr.latest = r.latest;
            else
                wr.latest = end;

            wr.risk = (wr.latest.getTime() - start.getTime()) /
                (end.getTime() - start.getTime());
            wr.risk *= r.risk;

            tgt.risks.push(wr);

        }

        tgt.risks.sort((a, b) => (b.risk - a.risk));

        return tgt;
    }

}

@Injectable({
    providedIn: 'root'
})
export class TargetSet {

    constructor(private riskGraph : RiskGraphService) {
        this.lastValue = {};
    }

    toTargetSet(graph : Graph, edge : string) : Target[] {

        let targets = {};

        for (let e of graph.edges) {

            if (e.group != edge) continue;

            if (!(e.source in targets)) {
                let tgt = new Target();
                tgt.id = e.source;
                tgt.risks = [];
                targets[e.source] = tgt;
            }

            let r = new Risk();
            r.category = e.destination;
            r.earliest = e.earliest;
            r.latest = e.latest;
            r.risk = getRiskValue(r.category);
            targets[e.source].risks.push(r);

        }

        let rtn = [];
        for (var t in targets) {
            rtn.push(targets[t]);
        }

        // Sort in overall risk order.
        rtn.sort((a, b) => { return b.risk - a.risk});

        return rtn;

    }

    lastValue : Object;

    subscribe(edge : string, f : any) {
        this.riskGraph.subscribe(g => {
            this.lastValue[edge] = this.toTargetSet(g, edge)
            f(this.lastValue[edge]);
        });
        // Give subscribers last value.
	if (edge in this.lastValue)
            f(this.lastValue[edge]);
    }

}

