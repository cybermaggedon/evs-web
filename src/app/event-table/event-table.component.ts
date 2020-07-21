import { Component, OnInit } from '@angular/core';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { ElasticSearchService } from '../elasticsearch.service';
import { WindowService, Window } from '../window.service';

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit {

    constructor(private eventSearch : EventSearchService,
		private windowService : WindowService,
		private es : ElasticSearchService) {
    }

    terms : SearchTerms;
    window : Window;

    ngOnInit(): void {

	this.eventSearch.subscribe(s => {
	    this.terms = s;
	    this.updateEs();
	});

	this.windowService.subscribe(w => {
	    this.window = w;
	    this.updateEs();
	});
    }

    esData : any;

    updateEs() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	this.es.search(this.terms, this.window).subscribe(r => {
	    this.esData = r;
	});

    }

}
