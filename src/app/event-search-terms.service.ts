
// Event search service, abstracts searching using the events table providing
// for search terms to be passed around.

import { Injectable } from '@angular/core';
import { Window } from './window.service';
import { Subject } from 'rxjs';

// Search terms.  Just abstracts an ID currently.
export interface SearchTerm {
    field : string;
    value : string;
};

export class SearchTerms {
    constructor(terms : SearchTerm[]) { this.terms = terms; };
    terms : SearchTerm[];
};

@Injectable({
  providedIn: 'root'
})
export class EventSearchTermsService {

    // Subject provides for search terms to be bussed around.
    subject : Subject<SearchTerms>;

    constructor() {
	this.subject = new Subject<SearchTerms>();
    }

    // Keep a last value to be pushed out to new subscribers.
    lastValue : SearchTerms;

    // Accept a new search term update.
    update(terms : SearchTerms) {
	this.subject.next(terms);
	this.lastValue = terms;
    }

    add(term : SearchTerm) {

	// Deliberately creating new object

	let terms = [];

	for(let it of this.lastValue.terms) {
	    terms.push(it);
	}

	terms.push(term);

	this.lastValue = new SearchTerms(terms);

	this.subject.next(this.lastValue);

    }

    // Subscribe to search terms.
    subscribe(f : any) {
        this.subject.subscribe(f);
	if (this.lastValue != undefined) {
	    f(this.lastValue);
	}
    }

}

