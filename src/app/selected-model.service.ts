import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedModelService {

    private subject : BehaviorSubject<string>;
    
    constructor() {
	this.subject = new BehaviorSubject<string>();

	let sel = localStorage.getItem("selected-model");
	if (sel != undefined)
	    this.subject.next(sel);

    }

    setModel(m : string) {
	this.subject.next(m);
    }

    subscribe(f : function(string) : void) {
	this.subject.subscribe(m => { f(m); });
    }

}

