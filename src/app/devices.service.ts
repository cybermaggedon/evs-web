import { Injectable } from '@angular/core';
import { RiskGraphService } from './risk-graph.service';
import { Graph } from './graph';
import { getRiskValue } from './risk';
import { nameToCssColour } from './colours';

export class DeviceRisk {
    category : string;
    risk : number;
    earliest : Date;
    latest : Date;

    colourName() : string {
        return nameToCssColour(this.category, "category");
    }

};

export class Device {
    device : string;
    risks : DeviceRisk[];

    getRiskScore() : number {

        let score = 1;

        for (let risk of this.risks) {
            score *= (1 - risk.risk);
        }

        return 1 - score;

    }

    applyWindow(start : Date, end : Date) : Device {

        let dev = new Device();
        dev.device = this.device;
        dev.risks = [];
        for (let r of this.risks) {
            if (r.earliest > end) continue;
            if (r.latest < start) continue;

            let wr = new DeviceRisk();

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

            dev.risks.push(wr);

        }

        dev.risks.sort((a, b) => (b.risk - a.risk));

        return dev;
    }

}

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

    constructor(private riskGraph : RiskGraphService) {
        this.lastValue = [];
    }

    toDevices(graph : Graph) : Device[] {

        let devices = {};

        for (let e of graph.edges) {

            if (e.group != "actorrisk") continue;

            if (!(e.source in devices)) {
                let dev = new Device();
                dev.device = e.source;
                dev.risks = [];
                devices[e.source] = dev;
            }

            let dr = new DeviceRisk();
            dr.category = e.destination;
            dr.earliest = e.earliest;
            dr.latest = e.latest;
            dr.risk = getRiskValue(dr.category);
            devices[e.source].risks.push(dr);

        }

        let rtn = [];
        for (var d in devices) {
            rtn.push(devices[d]);
        }

        // Sort in overall risk order.
        rtn.sort((a, b) => { return b.risk - a.risk});

        return rtn;

    }

    lastValue : Device[];

    subscribe(f : any) {
        this.riskGraph.subscribe(g => {
            this.lastValue = this.toDevices(g)
            f(this.lastValue);
        });
        // Give subscribers last value.
        f(this.lastValue);
    }

}

