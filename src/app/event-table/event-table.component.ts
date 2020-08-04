import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventSearchTermsService, SearchTerms } from '../event-search-terms.service';
import { EventSearchService, Filter, Page } from '../event-search.service';
import { WindowService, Window } from '../window.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

export interface Event {
    time : string;
    device : string;
    network : string;
    action : string;
    src : string;
    dest : string;
    protocol : string;
};

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit {

    constructor(private searchTermsSvc : EventSearchTermsService,
		private windowService : WindowService,
		private searchSvc : EventSearchService) {
	this.pageSize = 8;
	this.pageNum = 0;
	this.sortField = "time";
	this.sortAsc = false;
	this.data = new Page();
	this.data.data = [];
	this.loading = false;
    }

    terms : SearchTerms;
    window : Window;
    loading : boolean;

    ColumnMode = ColumnMode;

    ngOnInit(): void {

	this.searchTermsSvc.subscribe(s => {
	    this.terms = s;
	    this.pageNum = 0;
	    this.updateTable();
	});

	this.windowService.subscribe(w => {
	    this.window = w;
	    this.updateTable();
	});
    }

    data : Page;
    pageSize : number;
    pageNum : number;
    sortField : string;
    sortAsc : boolean;

    columns = [
	{name: "time", minWidth: "210"},
	{name: "device"},
	{name: "network"},
	{name: "action"},
	{name: "src-ipv4"},
	{name: "src-ipv6"},
	{name: "dest-ipv4"},
	{name: "dest-ipv6"},
	{name: "protocol"}
    ];

    @Input('max-events')
    maxEvents : number = 100;

    @Output('events-loaded')
    eventsLoaded : EventEmitter<number> = new EventEmitter<number>();

    updateTable() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	const fixmes = [
	    new Filter()
	];

//	this.loading = true;

	let obs = this.searchSvc.search(this.terms, this.window,
					this.sortField, this.sortAsc,
					fixmes, 0, this.maxEvents);

	obs.subscribe(r => {
	    this.data = r;
	    this.eventsLoaded.emit(r.total);
//	    this.loading = false;
	    if (this.data.numPages > 0 && this.pageNum > this.data.numPages) {
		this.pageNum = 0;
		// FIXME: Recursive?  The above conditions should make this
		// safe.
		this.updateTable();
	    }
	});

    }

    setPage(pageInfo) {
	this.pageNum = pageInfo.offset;
	this.updateTable();
    }

}
