import {
    Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EventSearchTermsService, SearchTerms } from '../event-search-terms.service';
import { Event, EventPage } from '../event-decode';
import { EventSourceService } from '../event-source.service';
import { WindowService, Window } from '../window.service';

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit, AfterViewInit {

    total = 0;

    row = [];

    constructor(private searchTermsSvc : EventSearchTermsService,
		private windowService : WindowService,
		public eventSvc : EventSourceService) {

//	this.loading = false;

    }

    @ViewChild(MatPaginator) paginator : MatPaginator;
    @ViewChild(MatSort) sort : MatSort;

    terms : SearchTerms;
    window : Window;

    pageNum : number = 0;
    pageSize : number = 10;


//    loading : boolean;
    
    ngOnInit(): void {

    }

    ngAfterViewInit() {

	this.sort.sortChange.subscribe(e => {
	    this.paginator.pageIndex = 0;
	    this.eventSvc.setSort(e.active, e.direction);
	});

	this.paginator.page.subscribe(e => {
	    this.pageNum = e.pageIndex;
	    this.pageSize = e.pageSize;
	    this.eventSvc.setPageNum(this.pageNum);
	    this.eventSvc.setPageSize(this.pageSize);
	});

	this.eventSvc.total.subscribe(total => {

	    this.total = total;

	    if (this.pageSize != undefined && this.pageNum != undefined) {

		// If the page number is beyond the number of events,
		// it's because a new query got executed.  Back to first page.
		if (total > 0 && total <= (this.pageSize * this.pageNum)) {
		    this.pageNum = 0;
		    this.eventSvc.setPageNum(0);
		}

	    }
		
	});

	this.eventSvc.setPageSize(this.pageSize);
	this.eventSvc.setPageNum(0);

    }
    displayedColumns = [

	'time', 'action', 'device',

	'src.ipv4', 'src.ipv6',
	'dest.ipv4', 'dest.ipv6',

	'indicators.category', 'indicators.value', 'indicators.description'

    ];

    maxEvents : number = 100;

    onRowClicked(row) {
	this.row = [];
	for(let field in row) {
	    this.row.push({field: field, value: row[field]});
	}
    }

}

