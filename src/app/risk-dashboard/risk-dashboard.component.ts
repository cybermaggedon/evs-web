import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import { interval } from 'rxjs';
import { throttle } from 'rxjs/operators';

@Component({
    selector: 'app-risk-dashboard',
    templateUrl: './risk-dashboard.component.html',
    styleUrls: ['./risk-dashboard.component.css']
})
export class RiskDashboardComponent implements OnInit {

    constructor(private riskSvc : RiskService) {
	// Initialise.
        this.model = new RiskModel();
	this.deviceReport = this.emptyReport;
	this.resourceReport = this.emptyReport;
	this.categoryReport = this.emptyReport;
    }

    @Input('max-items')
    maxItems : number = 20;

    ngOnInit(): void {

        this.riskSvc.subject.
	    pipe(throttle(() => interval(10000))).
	    subscribe(m => {
		console.log("UPDATE MODEL");
		this.model = m;
		this.updateFairModels();
	    });

    }

    deviceReport : any;
    resourceReport : any;
    categoryReport : any;

    emptyReport : Object = {
	distribution: "", exceedence: ""
    };

    model : RiskModel;

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

	for (let asset of this.model.devices) {
	    for (let risk of asset.risks) {
		if (!(risk.category in cats)) {
		    cats[risk.category] = 1.0;
		}
		cats[risk.category] *= (1 - risk.risk);
	    }
	}

	for (let asset of this.model.resources) {
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

	for (let asset of assets.slice(0, this.maxItems)) {
	    let model = this.getModel(asset.id, asset.getRiskScore());
	    models.push(model);
	}

	return {
	    "name": name,
	    "parameters": models
	};

    }

    getReports(model) {
	return {
	    "distribution": "/fair/" + model.name + "?report=distribution&model=" +
		encodeURIComponent(JSON.stringify(model)),
	    "exceedence": "/fair/" + model.name + "?report=exceedence&model=" +
		encodeURIComponent(JSON.stringify(model))
	};
    }

    updateFairModels() {

	console.log("UPDATINGGGGG");

        if (this.model.devices.length == 0) {
	    this.deviceReport = this.emptyReport;
	} else {
	    const assets = this.model.devices.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets, "Overall devices");
	    this.deviceReport = this.getReports(model);
	}

        if (this.model.resources.length == 0) {
	    this.resourceReport = this.emptyReport;
	} else {
	    const assets = this.model.resources.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets, "Overall resources");
	    this.resourceReport = this.getReports(model);
	}

	if ((this.model.devices.length == 0) &&
	    (this.model.resources.length == 0)) {
	    this.categoryReport = this.emptyReport;
	} else {
	    const model = this.getCatModel();
	    this.categoryReport = this.getReports(model);
	}

	console.log("UPDATE COMPLETTTT");

    }

}

