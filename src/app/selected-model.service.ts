import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedModelService {

    private subject : BehaviorSubject<string>;
    
    constructor() {
	this.subject = new BehaviorSubject<string>(undefined);

	let sel = localStorage.getItem("selected-model");
	if (sel == undefined) sel = "default";
        this.subject.next(sel);

    }

    setModel(m : string) {
	localStorage.setItem("selected-model", m);
	this.subject.next(m);
    }

    subscribe(f : (m : string) => void) {
	this.subject.subscribe(m => { f(m); });
    }

}

