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
    pageSize = 10;

    constructor(private searchTermsSvc : EventSearchTermsService,
		private windowService : WindowService,
		public searchSvc : EventSearchService) {

//	this.loading = false;

    }

    @ViewChild(MatPaginator) paginator : MatPaginator;
    @ViewChild(MatSort) sort : MatSort;

    terms : SearchTerms;
    window : Window;
//    loading : boolean;
    
    ngOnInit(): void {

    }

    ngAfterViewInit() {

	this.sort.sortChange.subscribe(e => {
	    // FIXME: NOT IMPLEMENTED
	    console.log("DIFFERENT SORT");
	    console.log(e);
	    this.paginator.pageIndex = 0;
	    this.searchSvc.setSort(e.active, e.direction);
	});

	this.paginator.page.subscribe(e => {
	    let pageNum = e.pageIndex;
	    let pageSize = e.pageSize;
	    this.searchSvc.setPageNum(pageNum);
	    this.searchSvc.setPageSize(pageSize);
	});

	this.searchSvc.total.subscribe(total => {
	    this.total = total;
	});

	this.searchSvc.setPageSize(this.pageSize);
	this.searchSvc.setPageNum(0);

    }
    displayedColumns = [
	'time', 'action',
	'device',
	'src.ipv4',
	'src.ipv6',
	//'src.tcp', 'src.udp',
	'dest.ipv4',
	'dest.ipv6',
	//'dest.tcp', 'dest.udp',
	'indicators.category', 'indicators.value', 
	'indicators.description'
    ];

    maxEvents : number = 100;

    @Output('events-loaded')
    eventsLoaded : EventEmitter<number> = new EventEmitter<number>();

    onRowClicked(row) {
	console.log('Row clicked: ', row);
    }

}
