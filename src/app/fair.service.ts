import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throttle } from 'rxjs/operators';
import { interval, Subject, Observable } from 'rxjs';

import { RiskModel } from './risk';
import { ModelStateService } from './model-state.service';
import { FinalRiskService } from './final-risk.service';

export interface FairReport {
    key : string;
    report : any;
};

function getFactors(params, factor=1.0) : Object {
    let f = {};
    if (params.low) f["low"] = params.low * factor;
    if (params.mode) f["mode"] = params.mode * factor;
    if (params.high) f["high"] = params.high * factor;
    if (params.mean) f["mean"] = params.mean * factor;
    if (params.stdev) f["stdev"] = params.stdev;
    if (params.constant) f["constant"] = params.constant * factor;
    return f;
}

function round(n : number, places : number) {
    return parseFloat(n.toFixed(places));
}

function getRiskFactors(params, factor=1.0) : Object {
    let f = {};
    if (params.low) f["low"] = round(params.low * factor, 2);
    if (params.mode) f["mode"] = round(params.mode * factor, 2);
    if (params.high) f["high"] = round(params.high * factor, 2);
    if (params.mean) f["mean"] = round(params.mean * factor, 2);
    if (params.stdev) f["stdev"] = round(params.stdev, 2);
    if (params.constant) f["constant"] = round(params.constant * factor, 2);
    return f;
}

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
	    pipe(throttle(() => interval(2000))).
	    subscribe(m => {
		this.riskModel = m;
		this.updateFairModels();
		this.updateCatModels();
	    });

	this.updateCatEvent = new Observable(obs => {
	    this.finalRisk.subscribe(frc => {
		this.riskProfiles[frc.id] = frc.profile;
		obs.next();
	    });
	});

	this.updateCatEvent.
	    pipe(throttle(() => interval(1000))).
	    subscribe(obs => {
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

    }

    getModel(name, risk) {

	// This stuff isn't grounded in the FAIR config, and should be.
	
	// Risk is rounded to 2 places to allow FAIR service to cache.
	// FIXME: hard-coded, should use a stddev input?
	const lef_low = round(risk / 1.4, 2);
	const lef_mode = round(risk, 2);
	const lef_high = round(risk * 1.4, 2);
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

    getCatModel(name, risk) {

	if (this.riskProfiles[name] == undefined)
	    return;

	let fair = this.riskProfiles[name].fair;

	let model = {
	    "name": name,
	    "parameters": {}
	};

	if (fair.r != undefined)
	    model.parameters["Risk"] =
	    getFactors(fair.r, risk);

	if (fair.lef != undefined)
	    model.parameters["Loss Event Frequency"] =
	    getFactors(fair.lef, risk);

	if (fair.tef != undefined)
	    model.parameters["Threat Event Frequency"] =
	    getFactors(fair.tef, risk);

	if (fair.c != undefined)
	    model.parameters["Contact Frequency"] =
	    getFactors(fair.c);

	if (fair.a != undefined)
	    model.parameters["Probability of Action"] =
	    getFactors(fair.a, risk);

	if (fair.v != undefined)
	    model.parameters["Vulnerability"] =
	    getFactors(fair.v);

	if (fair.tc != undefined)
	    model.parameters["Threat Capability"] =
	    getFactors(fair.tc);

	if (fair.cs != undefined)
	    model.parameters["Control Strength"] =
	    getFactors(fair.cs);

	if (fair.lm != undefined)
	    model.parameters["Loss Magnitude"] =
	    getFactors(fair.lm);

	if (fair.pl != undefined)
	    model.parameters["Primary Loss"] =
	    getFactors(fair.pl);

	if (fair.sl != undefined)
	    model.parameters["Secondary Loss"] =
	    getFactors(fair.sl);

	if (fair.slef != undefined)
	    model.parameters["Secondary Loss Event Frequency"] =
	    getFactors(fair.slef);

	if (fair.slem != undefined)
	    model.parameters["Secondary Loss Event Magnitude"] =
	    getFactors(fair.slem);

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

