import { Injectable } from '@angular/core';
import { Window } from './window.service';
import { Subject } from 'rxjs';

export class SearchTerms {
    constructor(id : string) { this.id = id; };
    id : string;
};

@Injectable({
  providedIn: 'root'
})
export class EventSearchService {

    subject : Subject<SearchTerms>;

    constructor() {
	this.subject = new Subject<SearchTerms>();
    }

    lastValue : Object;

    update(terms : SearchTerms) {
	this.subject.next(terms);
	this.lastValue = terms;
    }

    subscribe(f : any) {
        this.subject.subscribe(f);
	if (this.lastValue != undefined) {
	    f(this.lastValue);
	}
    }

}

