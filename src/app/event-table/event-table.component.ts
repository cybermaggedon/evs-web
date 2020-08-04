import {
    Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EventSearchTermsService, SearchTerms } from '../event-search-terms.service';
import { Event, EventPage } from '../event-decode';
import { EventSearchService } from '../event-search.service';
import { WindowService, Window } from '../window.service';

/*
export class Page {
    from : number;
    to : number;
    size : number;
    data : Object[];
    total : number;
    pageNum : number;
    numPages : number;
};
*/

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit, AfterViewInit {

    total = 0;

    constructor(private searchTermsSvc : EventSearchTermsService,
		private windowService : WindowService,
		private searchSvc : EventSearchService) {

	this.pageNum = 0;
	this.sortField = "time";
	this.sortAsc = false;
	this.pageSize = 10;
	this.page = {
	    from: 0,
	    to: 0,
	    total: 0,
	    events: []
	};
//	this.loading = false;
    }

    @ViewChild(MatPaginator) paginator : MatPaginator;
    @ViewChild(MatSort) sort : MatSort;

    terms : SearchTerms;
    window : Window;
//    loading : boolean;

    dataSource : EventSearchService;
    
    ngOnInit(): void {

	console.log("BUNCHYYYYY");

	//FIXME:
	
	this.searchTermsSvc.subscribe(s => {
	    console.log("TERMS", s);
	    this.terms = s;
	    this.pageNum = 0;
	    this.updateTable();
	});

	this.windowService.subscribe(w => {
	    console.log("WINDOW", w);
	    this.window = w;
	    this.updateTable();
	});

	console.log("BUNCHY");
	this.dataSource = this.searchSvc;
	this.dataSource.search();
/*	this.dataSource.load();
	    new SearchTerms([{ field: undefined, value: 'mark-vm' }]),
	    this.window,
	    'asc', 0, 10);*/

    }

    ngAfterViewInit() {

	this.sort.sortChange.subscribe(e => {
	    console.log("DIFFERENT SORT");
	    console.log(e);
	    this.paginator.pageIndex = 0;
	});

	this.paginator.page.subscribe(e => {
	    console.log(e);
	    this.pageNum = e.pageIndex;
	    this.dataSource.setPageNum(this.pageNum);
	});

	this.dataSource.total.subscribe(total => {
	    this.total = total;
	});

    }

    page : EventPage;
    pageSize : number;
    pageNum : number;
    sortField : string;
    sortAsc : boolean;

    /*
    columns = [
	{name: "time", minWidth: "210"},
	{name: "device"},
	{name: "network"},
	{name: "action"},
	{name: "src.ipv4"},
	{name: "src.ipv6"},
	{name: "dest.ipv4"},
	{name: "dest.ipv6"},
	{name: "protocol"}
    ];
    */

    displayedColumns = ['time', 'action'];

//    @Input('max-events')
    maxEvents : number = 100;

    @Output('events-loaded')
    eventsLoaded : EventEmitter<number> = new EventEmitter<number>();

//    dataSource : any;
    
    updateTable() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	 this.searchSvc.search();

//	obs.subscribe(r => {
//	    this.dataSource = r.data;
//	    this.page = r;

//	    this.eventsLoaded.emit(r.total);
//	    this.loading = false;

	    /*
	    if (this.page.numPages > 0 && this.pageNum > this.page.numPages) {
		this.pageNum = 0;
		// FIXME: Recursive?  The above conditions should make this
		// safe.
		this.updateTable();
	    }
*/
//	});

    }

    onRowClicked(row) {
	console.log('Row clicked: ', row);
    }

    setPage(pageInfo) {
//	this.updateTable();
    }

}
