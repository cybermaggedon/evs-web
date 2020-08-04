
// Service provides access to forensic events on ElasticSearch.
import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WindowService, Window } from './window.service';
import { ElasticSearchService } from './elasticsearch.service';
import { flattenESEvent, parseESResults, Event, Page } from './event-decode';
import {
    EventSearchTermsService, SearchTerms
} from './event-search-terms.service';

// ElasticSearch service
@Injectable({
    providedIn: 'root'
})
export class EventSearchService implements DataSource<Event> {

    private subject = new BehaviorSubject<any[]>([]);
    public loading = new BehaviorSubject<boolean>(false);

    terms : SearchTerms;
    window : Window;

    constructor(private esSvc : ElasticSearchService,
		private searchTermsSvc : EventSearchTermsService,
		private windowSvc : WindowService) {

	this.searchTermsSvc.subscribe(st => {
	    this.terms = st;
	    this.search();
	});

	this.windowSvc.subscribe(w => {
	    this.window = w;
	    this.search();
	});

    }

    // Hard-coded ES index name.
    index = "cyberprobe";

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
	return this.subject;
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loading.complete();
    }

    // Initiate an ES search.
    search() {

	let sort = "time";
	let sortAsc = true;
	let from = 0;
	let size = 10;
	
	console.log("QUERY");

	if (this.terms == undefined) return;
	if (this.terms.terms.length == 0) return;

        const start = `now-${this.window.value}h`;
	
        // Produce ElasticSearch query
	const qry = {
	    query: {
		bool: {
		    must: [
			{
			    multi_match: {
				query: this.terms.terms[0].value
			    }
			},
			{
			    range: {
				time: {
				    gte: start,
				    lt: 'now'
				}
			    }
			}
		    ]
		}
	    },
	    from: from, size: size,
	    sort: [
		{ [sort]: { order: (sortAsc ? "asc" : "desc") } }
	    ]
	};
	
        // Submit query, pipe through results parser.
	return this.esSvc.post(this.index + "/_search", qry).
            pipe(map(r => parseESResults(r, from, size))).
	    subscribe(r => {
		console.log("RESULTS ", r.data);
		this.subject.next(r.data);
	    });

    };

}

