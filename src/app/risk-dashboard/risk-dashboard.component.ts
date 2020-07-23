import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';

@Component({
    selector: 'app-risk-dashboard',
    templateUrl: './risk-dashboard.component.html',
    styleUrls: ['./risk-dashboard.component.css']
})
export class RiskDashboardComponent implements OnInit {

    constructor(private riskSvc : RiskService) {
	// Initialise.
        this.model = new RiskModel();
    }

    @Input('max-items')
    maxItems : number = 20;

    ngOnInit(): void {
        this.riskSvc.subscribe(m => {
	    this.model = m;
	    this.updateFairModels();
	});
    }

    deviceReport : any;
    resourceReport : any;
    categoryReport : any;

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
	    "name": "Overall",
	    "parameters": models
	};

    }

    getMetaModel(assets) {

	let models = [];

	for (let asset of assets.slice(0, this.maxItems)) {
	    let model = this.getModel(asset.id, asset.getRiskScore());
	    models.push(model);
	}

	return {
	    "name": "Overall model",
	    "parameters": models
	};

    }

    getReports(model) {
	return {
	    "distribution": "/fair/?report=distribution&model=" +
		encodeURIComponent(JSON.stringify(model)),
	    "exceedence": "/fair/?report=exceedence&model=" +
		encodeURIComponent(JSON.stringify(model))
	};
    }

    updateFairModels() {

        if (this.model.devices.length == 0) {
	    this.deviceReport = {
		"distribution": "",
		"exceedence": ""
	    };
	} else {
	    const assets = this.model.devices.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets);
	    this.deviceReport = this.getReports(model);
	}

        if (this.model.resources.length == 0) {
	    this.resourceReport = {
		"distribution": "",
		"exceedence": ""
	    };
	} else {
	    const assets = this.model.resources.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets);
	    this.resourceReport = this.getReports(model);
	}

	if ((this.model.devices.length == 0) &&
	    (this.model.resources.length == 0)) {
	    this.categoryReport = {
		"distribution": "",
		"exceedence": ""
	    }
	} else {
	    const model = this.getCatModel();
	    this.categoryReport = this.getReports(model);
	}

    }

}

