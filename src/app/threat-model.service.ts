import { Injectable } from '@angular/core';
import { RiskService } from './risk.service';
import { RiskModel } from './risk';
import { Subject } from 'rxjs';

function getRisk(all : Object, risk : string) :
{ id : string, score : number} {
    if (risk in all)
	return { id: risk, score: all[risk] };
    return { id: risk, score: 0 };
}

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
	
		]
	    },
	    {
		element: "gsuite-threat-auth",
		description: "auth threats",
		partition: "overview",
		risks: [
		]
	    },
	    {
		element: "research-threat",
		description: "IP threats",
		partition: "overview",
		risks: [
		    getRisk(risks2, "abuse-of-system-privileges")
		]
	    },
	    {
		element: "internet-threat",
		description: "IP threats",
		partition: "overview",
		risks: [
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
		]
	    },
	    {
		element: "prod-threat",
		description: "integrity threats",
		partition: "overview",
		risks: [
		    getRisk(risks2, "application-exploitation-via-input-manipulation"),
		    getRisk(risks2, "capture-of-stored-data")
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
		    getRisk(risks2, "capture-of-stored-data")
		]
	    },
	    {
		element: "prod-flyte-threat",
		description: "flyte exploit",
		partition: "production",
		risks: [
		    getRisk(risks2, "application-exploitation-via-input-manipulation")
		]
	    },
	    {
		element: "prod-accumulo-threat",
		description: "accumulo exploit",
		partition: "production",
		risks: [
		]
	    }
	];

	this.lastValue = threats;
	this.subject.next(threats);

    };

}
