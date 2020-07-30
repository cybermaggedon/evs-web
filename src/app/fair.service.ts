import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throttle } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

import { RiskModel } from './risk';
import { ModelStoreService } from './model-store.service';

// FIXME: Add some type safety information

const report_type : string[] = [
    'category-loss', 'category-pdf', 'category-summary', 'category-risk',
    'device-loss', 'device-pdf', 'device-summary', 'device-risk',
    'resource-loss', 'resource-pdf', 'resource-summary', 'resource-risk'
];

export interface FairReport {
    key : string;
    report : any;
};

@Injectable({
  providedIn: 'root'
})
export class FairService {

    private riskProfiles : Object;

    constructor(private http : HttpClient,
		private riskService : RiskService,
		private models : ModelStoreService
	       ) {

	this.subject = new Subject<any>();
	this.riskProfiles = {};

        this.riskService.subject.
	    pipe(throttle(() => interval(10000))).
	    subscribe(m => {
		this.riskModel = m;
		this.updateFairModels();
	    });

	models.subscribeCombinedRisk(rc => {
	    this.riskProfiles[rc.id] = rc.risk;
	});

    }

    subject : Subject<FairReport>;

    riskModel : RiskModel;

    lastValue : any = {};

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    updateModel(kind : string, report_type : string, model : any) : void {

	const report_key = kind + "-" + report_type;

	var url = "/fair/" + model.name + "?report=" + report_type + "&model=" +
	    encodeURIComponent(JSON.stringify(model));

	this.http.get(url).subscribe(report => {
	    this.lastValue[report_key] = report;
	    this.subject.next({
		key: report_key, report: report
	    })
	});

    }

    updateLossModel(kind : string, model : any) : void {
	this.updateModel(kind, "loss", model);
    }

    updatePdfModel(kind : string, model : any) : void {
	this.updateModel(kind, "pdf", model);
    }

    updateSummaryModel(kind : string, model : any) : void {
	this.updateModel(kind, "summary", model);
    }

    updateRiskModel(kind : string, model : any) : void {
	this.updateModel(kind, "risk", model);
    }

    updateFairModels() : void {

	const devModel = this.getMetaModel(this.riskModel.devices,
					   "All risks");
	this.updateLossModel("device", devModel);
	this.updatePdfModel("device", devModel);
	this.updateSummaryModel("device", devModel);
	this.updateRiskModel("device", devModel);

	const resModel = this.getMetaModel(this.riskModel.resources,
					   "All risks");
	this.updateLossModel("resource", resModel);
	this.updatePdfModel("resource", resModel);
	this.updateSummaryModel("resource", resModel);
	this.updateRiskModel("resource", resModel);

	const catModel = this.getCatMetaModel();
	this.updateLossModel("category", catModel);
	this.updatePdfModel("category", catModel);
	this.updateSummaryModel("category", catModel);
	this.updateRiskModel("category", catModel);

    }

    getModel(name, risk) {

	const lef_low = risk / 2.0
	const lef_mode = risk;
	const lef_high = risk * 2.0;
	const pl_low = 3000000 * risk;
	const pl_mode = 3500000 * risk;
	const pl_high = 4000000 * risk;
	const sl = 5000000 * risk;
	    
	return {
	    "name": name,
	    "parameters": {
		"Loss Event Frequency": {
		    "low": lef_low, "mode": lef_mode, "high": lef_high
		},
		"Primary Loss": {
		    "low": pl_low, "mode": pl_mode, "high": pl_high
		},
		"Secondary Loss": {
		    "constant": sl
		}
	    }
	};

    }

    getCatModel(name, risk) {

	if (this.riskProfiles[name] == undefined)
	    return;

	let fair = this.riskProfiles[name].fair;

	const lef_low = fair.lef_low * risk;
	const lef_mode = fair.lef_mode * risk;
	const lef_high = fair.lef_high * risk;
	const pl_low = fair.pl_low;
	const pl_mode = fair.pl_mode;
	const pl_high = fair.pl_high;
	const sl = fair.sl;
	    
	let model = {
	    "name": name,
	    "parameters": {
		"Loss Event Frequency": {
		    "low": lef_low, "mode": lef_mode, "high": lef_high
		},
		"Primary Loss": {
		    "low": pl_low, "mode": pl_mode, "high": pl_high
		},
		"Secondary Loss": {
		    "constant": sl
		}
	    }
	};
	console.log(model);
	return model;

    }

    getCatMetaModel() {

	let cats = {};

	for (let asset of this.riskModel.devices) {
	    for (let risk of asset.risks) {
		if (!(risk.category in cats)) {
		    cats[risk.category] = 1.0;
		}
		cats[risk.category] *= (1 - risk.risk);
	    }
	}

	for (let asset of this.riskModel.resources) {
	    for (let risk of asset.risks) {
		if (!(risk.category in cats)) {
		    cats[risk.category] = 1.0;
		}
		cats[risk.category] *= (1 - risk.risk);
	    }
	}

	for (let k in cats) {
	    cats[k] = 1 - cats[k];
	}

	let models = [];

	for (let k in cats) {
	    models.push(this.getCatModel(k, cats[k]));
	}

	return {
	    "name": "All risks",
	    "parameters": models
	};

    }

    getMetaModel(assets, name) {

	let models = [];

	for (let asset of assets) {
	    let model = this.getModel(asset.id, asset.getRiskScore());
	    models.push(model);
	}

	return {
	    "name": name,
	    "parameters": models
	};

    }

    subscribe(key : string, f : any) {
        this.subject.subscribe(rep => {
	    if (key == rep.key) {
		f(rep.report);
	    }
	});
	if (key in this.lastValue) {
	    f(this.lastValue[key]);
	}
    }

}

