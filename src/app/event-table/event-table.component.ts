import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { ElasticSearchService } from '../elasticsearch.service';
import { WindowService, Window } from '../window.service';

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
	this.data = [];
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

    data : any;

//     columns = [
//  	"time", "device", "network", "action",
//  	"srcip", "destip", "srcport", "destport", "protocol"
//      ];
    columns = [
	{name: "time"}, {name: "device"}, {name: "network"},
	{name: "action"}, {name: "srcip"}, {name: "destip"},
	{name: "srcport"}, {name: "destport"}, {name: "protocol"}
    ];

    updateEs() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	this.es.search(this.terms, this.window).subscribe(r => {
	    this.data = r;
	});

    }

}
