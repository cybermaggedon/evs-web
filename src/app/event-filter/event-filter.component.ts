import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

import {
    EventSearchTermsService, SearchTerms
} from '../event-search-terms.service';

@Component({
    selector: 'event-filter',
    templateUrl: 'event-filter.component.html',
    styleUrls: ['event-filter.component.css'],
})
export class EventFilterComponent implements OnInit {

    terms : SearchTerms;

    constructor(private termsSvc : EventSearchTermsService) {
    }

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    filters: string[] = [];

    ngOnInit() : void {
	this.termsSvc.subscribe((st : SearchTerms) => {

	    if (st == this.terms) return;
	    
	    this.terms = st;

	    this.filters = [];

	    for (let term of this.terms.terms) {
		if (term.field == undefined)
		    this.filters.push(term.value);
		else
		    this.filters.push(term.field + ":" + term.value);
	    }

	});
    }

    add(event: MatChipInputEvent) : void {

	const input = event.input;
	const value = event.value;

	// Add our filter
	if ((value || '').trim()) {
	    this.filters.push(value.trim());
	}
	
	// Reset the input value
	if (input) {
	    input.value = '';
	}

	this.update();

    }

    remove(filter: string) : void {
	const index = this.filters.indexOf(filter);

	if (index >= 0) {
	    this.filters.splice(index, 1);
	}

	this.update();

    }

    update() : void {

	let st = [];

	for (let filter of this.filters) {

	    let spl = filter.split(":", 2);
	    if (spl.length == 2) {
		st.push( { field: spl[0], value: spl[1] } );
	    } else if (spl.length == 1) {
		st.push( { field: undefined, value: spl[0] } );
	    }

	}

	let sts = new SearchTerms(st);
	this.termsSvc.update(sts);

    }

}

