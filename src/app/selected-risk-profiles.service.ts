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
	} else
	    this.selected = {};

    }

    setRiskProfile(risk : string, profile : string) {

	if (profile == undefined)
	    delete this.selected[risk];
	else
	    this.selected[risk] = profile;
	
	this.subject.next(new SelectedRiskProfile(risk, profile));
	localStorage.setItem("selected-risk-profiles",
			     JSON.stringify(this.selected));
    }

    subscribe(f : (s : SelectedRiskProfile) => void) {
	this.subject.subscribe(srp => { f(srp); });
	for(let k in this.selected) {
	    this.subject.next(new SelectedRiskProfile(k, this.selected[k]));
	}
    }

}

