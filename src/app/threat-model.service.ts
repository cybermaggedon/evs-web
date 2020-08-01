import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { RiskModel } from './risk';
import { Subject } from 'rxjs';

export class Threat {
    element : string;
    description : string;
    partition : string;
    risks : { id : string, score : number}[];
};

export type ThreatModel = Threat[];

@Injectable({
    providedIn: 'root'
})
export class ThreatModelService {

    subject : Subject<ThreatModel>;
    lastValue : ThreatModel;

    constructor(private riskService : RiskService) {

	this.subject = new Subject<ThreatModel>();

	this.riskService.subscribe((rm : RiskModel) => {
	    this.updateThreatModel(rm);
	});

    }

    subscribe(f : any) {
	this.subject.subscribe(tm => {
	    f(tm);
	});
	if (this.lastValue != undefined) {
	    f(this.lastValue);
	}
    }

    updateThreatModel(rm : RiskModel) {

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

	let risks2 = {};
        for(let k in risks) {
            risks2[k] = 1 - risks[k];
        }

	let threats = [
	    {
		element: "gsuite-threat-email",
		description: "email threats",
		partition: "overview",
		risks: [
		    { id: "tor-exit", score: risks2["tor-exit"] },
		    { id: "malware", score: risks2["malware"] },
		    { id: "credential-theft", score: risks2["credential-theft"] },
		]
	    },
	    {
		element: "gsuite-threat-auth",
		description: "auth threats",
		partition: "overview",
		risks: [ {
		    id: "tor-exit", score: risks2["tor-exit"]
		} ]
	    },
	    {
		element: "research-threat",
		description: "IP threats",
		partition: "overview",
		risks: [
		    { id: "tor-exit", score: risks2["tor-exit"] }
		]
	    },
	    {
		element: "internet-threat",
		description: "IP threats",
		partition: "overview",
		risks: [
		    { id: "tor-exit", score: risks2["tor-exit"] }
	    ]
	    },
	    {
		element: "office-threat",
		description: "network threats",
		partition: "overview",
		risks: [
		]
	    },
	    {
		element: "payment-threat",
		description: "fraud threats",
		partition: "overview",
		risks: [
		    { id: "credential-theft", score: risks2["credential-theft"] },
		]
	    },
	    {
		element: "prod-threat",
		description: "integrity threats",
		partition: "overview",
		risks: [
		]
	    },
	    {
		element: "it-threat",
		description: "device threats",
		partition: "overview",
		risks: [
		]
	    },
	    {
		element: "prod-payment-threat",
		description: "payment exploit",
		partition: "production",
		risks: [
		    { id: "credential-theft", score: risks2["credential-theft"] }
		]
	    },
	    {
		element: "prod-flyte-threat",
		description: "flyte exploit",
		partition: "production",
		risks: [
		    { id: "malware", score: risks2["malware"] }
		]
	    },
	    {
		element: "prod-accumulo-threat",
		description: "accumulo exploit",
		partition: "production",
		risks: [
		    { id: "credential-theft", score: risks2["credential-theft"] }
		]
	    }
	];

	this.lastValue = threats;
	this.subject.next(threats);

    };

}
