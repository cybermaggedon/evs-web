import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelSet } from './model-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {

    subject : BehaviorSubject<ModelSet>;

    constructor(private http : HttpClient) {

	this.subject = new BehaviorSubject<ModelSet>([]);

	this.http.get<ModelSet>("/assets/model-defs.json").subscribe(ms => {

	    this.subject.next(ms);

	});

    }

    subscribe(f : (m : ModelSet) => void) {

	this.subject.subscribe(ms => {
	    f(ms);
	});
	
    }

}
