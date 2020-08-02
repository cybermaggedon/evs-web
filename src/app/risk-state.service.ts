import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RiskLoaderService } from './risk-loader.service';
import { Risk, RiskProfile } from './model-types';
import { walk, FlatItem, flattenHierarchy } from './hierarchy';

export interface RiskIndex {
    [key : string] : Risk;
};

export interface RiskProfileIndex {
    [key : string] : {
	[key : string] : RiskProfile;
    }
};

export class RiskState {
    risks : { [key : string]: FlatItem<RiskProfile>[]; };
    default : { [key : string] : RiskProfile };
    riskProfileIndex : RiskProfileIndex;
};

@Injectable({
  providedIn: 'root'
})
export class RiskStateService {

    subject : BehaviorSubject<RiskState>;
    
    constructor(private loader : RiskLoaderService) {

	this.subject = new BehaviorSubject<RiskState>(new RiskState());


	this.loader.subscribe(rs => {

	    let state = new RiskState();
	    state.risks = {};
	    state.default = {};
	    state.riskProfileIndex = {};

	    for (let risk of rs) {

		state.risks[risk.id] = flattenHierarchy(risk.profiles);
		state.riskProfileIndex[risk.id] = {};
		for(let profile of state.risks[risk.id]) {

		    state.riskProfileIndex[risk.id][profile.value.id] =
			profile.value;

		    if (profile.default) {
			state.default[risk.id] = profile.value
		    }

		}

	    }

	    this.subject.next(state);

	});

    }

    subscribe(f : (rs : RiskState) => void) {
	this.subject.subscribe(rs => { f(rs); });
    }


}
