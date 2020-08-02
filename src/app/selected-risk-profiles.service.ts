import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class SelectedRiskProfile {
    risk : string;
    profile : string;
    constructor(risk : string, profile : string) {
	this.risk = risk;
	this.profile = profile;
    }
};

@Injectable({
  providedIn: 'root'
})
export class SelectedRiskProfilesService {

    private subject : Subject<SelectedRiskProfile>;

    selected : Object;

    constructor() {

	this.subject = new Subject<SelectedRiskProfile>();

	let sel = localStorage.getItem("selected-risk-profiles");
	if (sel != undefined) {
	    this.selected = JSON.parse(sel);
	}

    }

    setRiskProfile(risk : string, profile : string) {
	this.selected[risk] = profile;
	this.subject.next(new SelectedRiskProfile(risk, profile));
    }

    subscribe(f : function(SelectedRiskProfile) : void) {
	this.subject.subscribe(srp => { f(srp); });
	for(let k in this.selected) {
	    this.subject.next(new SelectedRiskProfile(k, this.selected[k]));
	}
    }

}

