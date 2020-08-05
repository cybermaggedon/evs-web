
// Service provides access to forensic events on ElasticSearch.
import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WindowService, Window } from './window.service';
import { ElasticSearchService } from './elasticsearch.service';
import { flattenESEvent, parseESResults, Event, EventPage } from './event-decode';
import {
    EventSearchTermsService, SearchTerms
} from './event-search-terms.service';

// ElasticSearch service
@Injectable({
    providedIn: 'root'
})
export class EventSearchService implements DataSource<Event> {

    private subject = new BehaviorSubject<Event[]>([]);
    public loading = new BehaviorSubject<boolean>(false);
    public total = new BehaviorSubject<number>(0);
    
    terms : SearchTerms;
    window : Window;

    pageNum = 0;
    pageSize = 10;

    sortField = "time";
    sortAsc = false;

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
    }

    // Initiate an ES search.
    private search() {

	let from = this.pageNum * this.pageSize;
	let size = this.pageSize;

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
		{ [this.sortField]: { order: (this.sortAsc ? "asc" : "desc") } }
	    ]
	};
	
        // Submit query, pipe through results parser.
	return this.esSvc.post(this.index + "/_search", qry).
            pipe(map(r => parseESResults(r, from, size))).
	    subscribe(r => {
		this.subject.next(r.events);
		this.total.next(r.total);
	    });

    };

    setPageSize(n : number) {
	this.pageSize = n;
	this.search();
    }

    setPageNum(n : number) {
	this.pageNum = n;
	this.search();
    }

    setSort(field : string, dir : string) {
	this.sortField = field;
	this.sortAsc = dir == "asc";
	this.search();
    }

}

