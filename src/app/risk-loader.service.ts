import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RiskSet } from './model-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiskLoaderService {

    subject : BehaviorSubject<RiskSet>;

    constructor(private http : HttpClient) {

	this.subject = new BehaviorSubject<RiskSet>([]);
  
	// Get the settings from risk-profiles
	this.http.get<RiskSet>("/assets/risk-profiles.json").subscribe(rs => {
	    this.subject.next(rs);
	});

    }

    subscribe(f : (r : RiskSet) => void) {

	this.subject.subscribe(rs => {
	    f(rs);
	});
	
    }

}

