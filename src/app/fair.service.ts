import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throttle } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

import { RiskModel } from './risk';

// FIXME: Add some type safety information

@Injectable({
  providedIn: 'root'
})
export class FairService {

    constructor(private http : HttpClient,
		private riskService : RiskService) {

	this.subject = new Subject<any>();

	console.log("START RISKSERVICE");
        this.riskService.subject.
	    pipe(throttle(() => interval(2000))).
	    subscribe(m => {
		console.log("GOT RISKSERVICE");
		this.riskModel = m;
		this.updateFairModels();
	    });

    }

    subject : Subject<any>;

    riskModel : RiskModel;

    fairModel : any = {};

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    updateFairModels() : void {

	if (this.riskModel.devices.length == 0) {

	    this.fairModel.devices = {};
	    this.subject.next(this.fairModel);

	} else {

	    const devModel = this.getMetaModel(this.riskModel.devices,
					       "Overall devices");
	    var devCurvesUrl = "/fair/" + devModel.name +
		"?report=curves&model=" +
		encodeURIComponent(JSON.stringify(devModel));
	    this.http.get(devCurvesUrl).subscribe(curves => {
		console.log("GOT DEV");
		this.fairModel.devices = curves;
		this.subject.next(this.fairModel);
	    });

	}

	if (this.riskModel.resources.length == 0) {

	    this.fairModel.resources = {};
	    this.subject.next(this.fairModel);

	} else {

	    const resModel = this.getMetaModel(this.riskModel.resources,
					       "Overall resources");
	    var rptUrl = "/fair/" + resModel.name + "?report=curves&model=" +
		encodeURIComponent(JSON.stringify(resModel));
	    this.http.get(rptUrl).subscribe(curves => {
		console.log("GOT RES");
		this.fairModel.resources = curves;
		this.subject.next(this.fairModel);
	    });

	}

	if (this.riskModel.devices.length == 0 &&
	   this.riskModel.resources.length == 0) {

	    this.fairModel.categories = {};
	    this.subject.next(this.fairModel);

	} else {

	    const catModel = this.getCatModel();
	    var rptUrl = "/fair/" + catModel.name + "?report=curves&model=" +
		encodeURIComponent(JSON.stringify(catModel));
	    this.http.get(rptUrl).subscribe(curves => {
		console.log("GOT CAT");
		this.fairModel.categories = curves;
		this.subject.next(this.fairModel);
	    });

	}

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

    getCatModel() {

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
	    models.push(this.getModel(k, cats[k]));
	}

	return {
	    "name": "Overall risk",
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

    subscribe(f : any) {
        this.subject.subscribe(f);
	f(this.fairModel);
    }

}

