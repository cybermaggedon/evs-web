
import { Graph } from './graph';
const risks = {
    'malware': 0.1,
    'tor-exit': 0.7
};

function getCategoryRiskValue(category : string) : number {

    if (category in risks) {
        return risks[category];
    }
    return 0.3;
}

export function nameToCssColour(name : string, kind : string) : string {
    let a = 0;
    for (let c of (name + kind)) {
        let code = c.charCodeAt(0) % 127;
        a = (a ^ code) & 127;
    }
    let r = (a % 7) * 16;
    let g = ((a >> 3) % 7) * 16;
    let b = ((a >> 6) % 7) * 16;
    g ^= r;
    b ^= g;

    r = 4 + 2 * r; g = 4 + 2 * g; b = 4 + 2 * b;

    let rgb  = `rgb(${r},${g},${b})`;
    return rgb;
}

export class Risk {
    category : string;
    risk : number;
    earliest : Date;
    latest : Date;

    colourName() : string {
        return nameToCssColour(this.category, "category");
    }

};

export class Asset {

    id : string;
    risks : Risk[];

    getRiskScore() : number {

        let score = 1;

        for (let risk of this.risks) {
            score *= (1 - risk.risk);
        }

        return 1 - score;

    }

    applyWindow(start : Date, end : Date) : Asset {

        let asset = new Asset();

        asset.id = this.id;
        asset.risks = [];
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

            asset.risks.push(wr);

        }

        // Sort risks against an asset in risk order
        asset.risks.sort((a, b) => (b.risk - a.risk));

        return asset;
    }

}

function windowAssets(assets : Asset[], start : Date, minRisk) : Asset[] {

    let rtn : Asset[] = [];

    const now = new Date();

    for (let asset of assets) {
        let w = asset.applyWindow(start, now);
        if (w.getRiskScore() > minRisk) {
            rtn.push(w);
        }
    }

    rtn.sort((a, b) => (b.getRiskScore() - a.getRiskScore()));

    return rtn

}

export class RiskModel {
    devices : Asset[];
    resources : Asset[];

    constructor() {
	this.devices = [];
	this.resources = [];
    }

    applyWindow(start : Date, minRisk = 0.05) : RiskModel {

        let rm = new RiskModel();

	rm.devices = windowAssets(this.devices, start, minRisk);
	rm.resources = windowAssets(this.resources, start, minRisk);

	return rm;

    }


}

export function toAssetArray(graph : Graph, edge : string) : Asset[] {

    let assets = {};

    for (let e of graph.edges) {

	if (e.group != edge) continue;

	if (!(e.source in assets)) {
	    let asset = new Asset();
	    asset.id = e.source;
	    asset.risks = [];
	    assets[e.source] = asset;
	}

	let r = new Risk();
	r.category = e.destination;
	r.earliest = e.earliest;
	r.latest = e.latest;
	r.risk = getCategoryRiskValue(r.category);
	assets[e.source].risks.push(r);

    }

    let rtn : Asset[] = [];
    for (var a in assets) {
	rtn.push(assets[a]);
    }

    // Sort in overall risk order.
    rtn.sort((a, b) => { return b.getRiskScore() - a.getRiskScore()});

    return rtn;

}

export function toRiskModel(graph : Graph) : RiskModel {

    let model = new RiskModel();
    model.devices = toAssetArray(graph, "actorrisk");
    model.resources = toAssetArray(graph, "resourcerisk");
    return model;

}
