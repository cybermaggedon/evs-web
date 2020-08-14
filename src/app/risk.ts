
// Miscellaneous risk structures.

import { Graph } from './graph';

// Returns risk score, using a default if risk score is not known.
export function getRiskScoreFromFair(fair : any) : number {

    let arbitrary = 2000000;

    let prob = fair["mean"] / arbitrary;
    if (prob > 1) return 1.0;
    return prob;

}

// Returns risk score, using a default if risk score is not known.
function getCategoryRiskValue(category : string, fair : any) : number {

    if (category in fair) {
	return getRiskScoreFromFair(fair[category]);
    }

    return 0.0;

}

// Translate a name (risk category / threat type) to a CSS class.
// The name is hashed to a suffix which is added to the string 'category'.
export function nameToCssClass(name : string) : string {
    let a = 0;
    for (let c of name) {
        let code = c.charCodeAt(0) % 127;
        a = (a ^ code) & 127;
    }
    let c = (a % 11);
    return "category" + c;
}

// Risk category attribution.  Includes category name, time period over
// which observation takes place.
export class Risk {

    // Risk category ID
    category : string;

    // Risk score
    risk : number;

    // Period of observation
    earliest : Date;
    latest : Date;

    // Return CSS class name
    className() : string {
        return nameToCssClass(this.category);
    }

};

// Risk description for an asset (device or resource).
export class Asset {

    // Asset ID
    id : string;

    // Associated risks.
    risks : Risk[];

    // Return combined risk score.
    getRiskScore() : number {

        let score = 1;

        for (let risk of this.risks) {
            score *= (1 - risk.risk);
        }

        return 1 - score;

    }

    // Return new asset description, windowed.
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

// Apply time window to an asset array, returning new asset array.
function windowAssets(assets : Asset[], start : Date, minRisk) : Asset[] {

    let rtn : Asset[] = [];

    const now = new Date();

    for (let asset of assets) {
        let w = asset.applyWindow(start, now);
        if (w.getRiskScore() > minRisk) {
            rtn.push(w);
        }
    }

    // Sort by risk score.
    rtn.sort((a, b) => (b.getRiskScore() - a.getRiskScore()));

    return rtn

}

// Risk Model, containes risk description for devices and resources.
export class RiskModel {
    devices : Asset[];
    resources : Asset[];

    constructor() {
	this.devices = [];
	this.resources = [];
    }

    applyWindow(start : Date, minRisk = 0.0) : RiskModel {

        let rm = new RiskModel();

	rm.devices = windowAssets(this.devices, start, minRisk);
	rm.resources = windowAssets(this.resources, start, minRisk);

	return rm;

    }

}

// Convert graph to an array of assets.  edge specifies the graph edges
// to use.
export function toAssetArray(graph : Graph, edge : string, fair : any) :
Asset[] {

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
	r.risk = getCategoryRiskValue(r.category, fair);
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

// Convert a graph to a risk model.
export function toRiskModel(graph : Graph, fair : any) : RiskModel {

    let model = new RiskModel();
    model.devices = toAssetArray(graph, "actorrisk", fair);
    model.resources = toAssetArray(graph, "resourcerisk", fair);
    return model;

}
