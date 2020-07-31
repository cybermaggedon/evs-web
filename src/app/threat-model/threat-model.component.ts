import { Component, OnInit } from '@angular/core';
import { nameToCssClass } from '../risk';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';

@Component({
  selector: 'app-threat-model',
  templateUrl: './threat-model.component.html',
  styleUrls: ['./threat-model.component.css']
})
export class ThreatModelComponent implements OnInit {

    risks = {};

    constructor(private riskService : RiskService) {
    	this.risks = {
	    "credential-theft": 0,
	    "malware": 0,
	    "tor-exit": 0
	};
    }

    ngOnInit(): void {

	this.riskService.subscribe((rm : RiskModel) => {

	    //	    this.risks = r;

	    let risks = {
		"credential-theft": 1.0,
		"malware": 1.0,
		"tor-exit": 1.0
	    };

	    for (let asset of rm.devices) {
		for (let risk of asset.risks) {
		    if (!(risk.category in risks)) {
			risks[risk.category] = 1;
		    }
		    risks[risk.category] *= (1 - risk.risk);
		}
	    }

	    for (let asset of rm.resources) {
		for (let risk of asset.risks) {
		    if (!(risk.category in risks)) {
			risks[risk.category] = 1;
		    }
		    risks[risk.category] *= (1 - risk.risk);
		}
	    }

	    for(let k in risks) {
		this.risks[k] = 1 - risks[k];
	    }

	    // FIXME: This is fairly random.
	    this.threats[0].risks = [
		{ id: "tor-exit", score: this.risks["tor-exit"] },
		{ id: "credential-theft", score: this.risks["credential-theft"] * 0.4 }
	    ];

	    this.threats[1].risks = [
		{ id: "credential-theft", score: this.risks["credential-theft"] * 0.8 }
	    ];

	    this.threats[2].risks = [
		{ id: "tor-exit", score: this.risks["tor-exit"] * 0.5 }
	    ];

	    this.threats[4].risks = [
		{ id: "credential-theft", score: this.risks["credential-theft"] }
	    ];

	});

    }

    threats = [
	{
	    id: "gsuite-threat-email",
	    description: "email threats",
	    risks: [
		{ id: "tor-exit", score: 0.4 },
		{ id: "malware", score: 0.2 },
		{ id: "credential-theft", score: 0.2 },
	    ]
	},
	{
	    id: "gsuite-threat-auth",
	    description: "auth threats",
	    risks: [ {
		    id: "tor-exit", score: 0.8
	    } ]
	},
	{
	    id: "research-threat",
	    description: "IP threats",
	    risks: [
		{ id: "tor-exit", score: 0.2 }
	    ]
	},
	{
	    id: "office-threat",
	    description: "network threats",
	    risks: [
	    ]
	},
	{
	    id: "payment-threat",
	    description: "fraud threats",
	    risks: [
		{ id: "credential-theft", score: 0.1 },
	    ]
	},
	{
	    id: "prod-threat",
	    description: "integrity threats",
	    risks: [
	    ]
	},
	{
	    id: "it-threat",
	    description: "device threats",
	    risks: [
	    ]
	}
    ];

    nameToCssClass = nameToCssClass;

}

