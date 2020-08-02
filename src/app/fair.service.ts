import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throttle } from 'rxjs/operators';
import { interval, Subject, Observable } from 'rxjs';

import { RiskModel } from './risk';
import { ModelStateService } from './model-state.service';
import { FinalRiskService } from './final-risk.service';

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

    reportSubject : Subject<FairReport>;
    recalcEventSubject : Subject<string>;

    riskModel : RiskModel;

    lastValue : any = {};

    private riskProfiles : Object;

    updateCatEvent : Observable<void>;

    constructor(private http : HttpClient,
		private riskService : RiskService,
		private models : ModelStateService,
		private finalRisk : FinalRiskService
	       ) {

	this.reportSubject = new Subject<FairReport>();
	this.recalcEventSubject = new Subject<string>();
	this.riskProfiles = {};

        this.riskService.subject.
	    pipe(throttle(() => interval(1000))).
	    subscribe(m => {
//		console.log("RISK MODEL", m);
		this.riskModel = m;
		this.updateFairModels();
	    });

	this.updateCatEvent = new Observable(obs => {
	    this.riskService.subscribe(frc => {
//		console.log("final risk ", frc.id);
		this.riskProfiles[frc.id] = frc.risk;
		obs.next();
	    });
	});

	this.updateCatEvent.subscribe(obs => {
//	    console.log(obs);
	    this.updateCatModels();
	});

    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    updateModel(kind : string, report_type : string, model : any) : void {

	const report_key = kind + "-" + report_type;

	// Tell everyone we're recalculating models.
	this.recalcEventSubject.next(report_key);

	var url = "/fair/" + model.name + "?report=" + report_type + "&model=" +
	    encodeURIComponent(JSON.stringify(model));

	this.http.get(url).subscribe(report => {
	    this.lastValue[report_key] = report;
	    this.reportSubject.next({
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

    updateCatModels() : void {

	const catModel = this.getCatMetaModel();
	if (catModel == undefined) return;

	this.updateLossModel("category", catModel);
	this.updatePdfModel("category", catModel);
	this.updateSummaryModel("category", catModel);
	this.updateRiskModel("category", catModel);

    }

    updateFairModels() : void {

	const devModel = this.getMetaModel(this.riskModel.devices,
					   "All risks");
	if (devModel != undefined) {

	    this.updateLossModel("device", devModel);
	    this.updatePdfModel("device", devModel);
	    this.updateSummaryModel("device", devModel);
	    this.updateRiskModel("device", devModel);

	}

	const resModel = this.getMetaModel(this.riskModel.resources,
					   "All risks");
	if (resModel != undefined) {
	    this.updateLossModel("resource", resModel);
	    this.updatePdfModel("resource", resModel);
	    this.updateSummaryModel("resource", resModel);
	    this.updateRiskModel("resource", resModel);
	}

	this.updateCatModels();

    }

    getModel(name, risk) {

// Risk is rounded to 2 places to allow FAIR service to cache.
    // FIXME: hard-coded, should use a stddev input?
	const lef_low = this.round(risk / 1.4, 2);
	const lef_mode = this.round(risk, 2);
	const lef_high = this.round(risk * 1.4, 2);
	const pl_low = 100000;
	const pl_mode = 200000;
	const pl_high = 250000;
	const sl = 200000;
	    
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

    round(n : number, places : number) {
        return parseFloat(n.toFixed(places));
    }

    getCatModel(name, risk) {

	if (this.riskProfiles[name] == undefined)
	    return;

	let fair = this.riskProfiles[name].fair;

	const lef_low = this.round(fair.lef_low * risk, 2);
	const lef_mode = this.round(fair.lef_mode * risk, 2);
	const lef_high = this.round(fair.lef_high * risk, 2);
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

	return model;

    }

    getCatMetaModel() {

	if (this.riskModel == undefined) return;

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
        this.reportSubject.subscribe(rep => {
	    if (key == rep.key) {
		f(rep.report);
	    }
	});
	if (key in this.lastValue) {
	    f(this.lastValue[key]);
	}
    }

    subscribeRecalcEvent(key : string, f : any) {
        this.recalcEventSubject.subscribe(k => {
	    if (key == k) {
		f();
	    }
	});
    }

}

