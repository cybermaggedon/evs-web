import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { ElasticSearchService, Filter, Page } from '../elasticsearch.service';
import { WindowService, Window } from '../window.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

export interface Event {
    time : string;
    device : string;
    network : string;
    action : string;
    srcip : string;
    destip : string;
    srcport : string;
    destport : string;
    protocol : string;
};

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit {

    constructor(private eventSearch : EventSearchService,
		private windowService : WindowService,
		private es : ElasticSearchService) {
	this.pageSize = 8;
	this.pageNum = 0;
	this.data = new Page();
	this.data.data = [];
    }

    terms : SearchTerms;
    window : Window;

    ColumnMode = ColumnMode;

    ngOnInit(): void {

	this.eventSearch.subscribe(s => {
	    this.terms = s;
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

    columns = [
	{name: "time"}, {name: "device"}, {name: "network"},
	{name: "action"}, {name: "srcip"}, {name: "destip"},
	{name: "srcport"}, {name: "destport"}, {name: "protocol"}
    ];

    updateTable() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	const fixmes = [
	    new Filter()
	];

	let obs = this.es.search(this.terms, this.window, "time",
				 fixmes, this.pageSize * this.pageNum,
				 this.pageSize);

	obs.subscribe(r => {
	    this.data = r;
	    console.log(r);
	});

    }

    setPage(pageInfo) {
	this.pageNum = pageInfo.offset;
	this.updateTable();
    }

}
