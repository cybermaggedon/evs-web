import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RiskLoaderService } from './risk-loader.service';
import { Risk, RiskProfile } from './model-types';
import { walk, FlatItem, flattenHierarchy } from './hierarchy';

export class RiskState {
    risk : Risk;
    profiles : FlatItem<RiskProfile>[];
    default : RiskProfile;
    profileIndex : { [key : string] : RiskProfile; };
    nameIndex : { [key : string] : string };
};

export class AllRisksState {
    risks : RiskState[];
    riskIndex : { [key : string] : RiskState };
    currentProfile(risk : string, def : string, sel : string) : RiskProfile {

	if (risk == undefined || !(risk in this.riskIndex))
	    return undefined;

	if (sel != undefined && sel in this.riskIndex[risk].profileIndex) {
	    return this.riskIndex[risk].profileIndex[sel];
	}

	if (def != undefined && def in this.riskIndex[risk].profileIndex) {
	    return this.riskIndex[risk].profileIndex[def];
	}

	return undefined;

    }
    constructor() {
	this.risks = [];
	this.riskIndex = {};
    }
};

@Injectable({
  providedIn: 'root'
})
export class RiskStateService {

    subject : BehaviorSubject<AllRisksState>;
    
    constructor(private loader : RiskLoaderService) {

	this.subject = new BehaviorSubject<AllRisksState>(new AllRisksState());


	this.loader.subscribe(rs => {

	    let allstate = new AllRisksState();
	    allstate.risks = [];
	    allstate.riskIndex = {};

	    for (let risk of rs) {

		let state = new RiskState();
		state.risk = risk;
		state.profiles = flattenHierarchy(risk.profiles);
		state.profileIndex = {};
		state.nameIndex = {};

		for(let profile of state.profiles) {

		    state.profileIndex[profile.value.id] = profile.value;
		    state.nameIndex[profile.value.id] = profile.name;

		    if (profile.default)
			state.default = profile.value;
		}

		allstate.risks.push(state);
		allstate.riskIndex[risk.id] = state;

	    }

	    this.subject.next(allstate);

	});

    }

    subscribe(f : (rs : AllRisksState) => void) {
	this.subject.subscribe(rs => { f(rs); });
    }


}
