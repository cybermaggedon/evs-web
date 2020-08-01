import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelSet, Risk } from './model-types';
import { Subject } from 'rxjs';

export class ModelSpecification {
    models : ModelSet;
    risks : Risk[];
}

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {

    private spec : ModelSpecification;
    private subject : Subject<ModelSpecification>;

    constructor(private http : HttpClient) {
	this.spec = new ModelSpecification();
	this.subject = new Subject<ModelSpecification>();

	this.http.get<ModelSet>("/assets/model-defs.json").subscribe(ms => {

	    this.spec.models = ms;

	    if (this.spec.models == undefined ||
		this.spec.risks == undefined)
		return;

	    this.subject.next(this.spec);

	});

	// Get the settings from risk-profiles
	this.http.get<Risk[]>("/assets/risk-profiles.json").subscribe(rp => {
	    
	    this.spec.risks = rp;
	    
	    if (this.spec.models == undefined ||
		this.spec.risks == undefined)
		return;

	    this.subject.next(this.spec);

	});

    }

    subscribe(f : any) {

	this.subject.subscribe(ms => {
	    f(ms);
	});

	if (this.spec.models == undefined ||
	    this.spec.risks == undefined)
	    return;

	f(this.spec);
	
    }

}
