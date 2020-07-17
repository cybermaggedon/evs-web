import { Injectable } from '@angular/core';
import { RiskGraphService } from './risk-graph.service';
import { Graph } from './graph';
import { getRiskValue } from './risk';
import { nameToCssColour } from './colours';

export class ResourceRisk {
    category : string;
    risk : number;
    earliest : Date;
    latest : Date;

    colourName() : string {
        return nameToCssColour(this.category, "category");
    }

};

export class Resource {
    resource : string;
    risks : ResourceRisk[];

    getRiskScore() : number {

        let score = 1;

        for (let risk of this.risks) {
            score *= (1 - risk.risk);
        }

        return 1 - score;

    }

    applyWindow(start : Date, end : Date) : Resource {

        let res = new Resource();
        res.resource = this.resource;
        res.risks = [];
        for (let r of this.risks) {
            if (r.earliest > end) continue;
            if (r.latest < start) continue;

            let wr = new ResourceRisk();

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

            res.risks.push(wr);

        }

        res.risks.sort((a, b) => (b.risk - a.risk));

        return res;
    }

}

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    constructor(private riskGraph : RiskGraphService) {
        this.lastValue = [];
    }

    toResources(graph : Graph) : Resource[] {

        let resources = {};

        for (let e of graph.edges) {

            if (e.group != "resourcerisk") continue;

            if (!(e.source in resources)) {
                let res = new Resource();
                res.resource = e.source;
                res.risks = [];
                resources[e.source] = res;
            }

            let rr = new ResourceRisk();
            rr.category = e.destination;
            rr.earliest = e.earliest;
            rr.latest = e.latest;
            rr.risk = getRiskValue(rr.category);
            resources[e.source].risks.push(rr);

        }

        let rtn = [];
        for (var r in resources) {
            rtn.push(resources[r]);
        }

        // Sort in overall risk order.
        rtn.sort((a, b) => { return b.risk - a.risk});

        return rtn;

    }

    lastValue : Resource[];

    subscribe(f : any) {
        this.riskGraph.subscribe(g => {
            this.lastValue = this.toResources(g);
            f(this.lastValue);
        });
        // Give subscribers last value.
        f(this.lastValue);
    }

}

