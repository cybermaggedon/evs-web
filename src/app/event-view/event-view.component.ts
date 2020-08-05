import { Component, OnInit, AfterViewInit } from '@angular/core';

import {
    EventSearchTermsService, SearchTerms
} from '../event-search-terms.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit, AfterViewInit {

    tableEvents : number;

    // Called when events are loaded in the table
    onEventsLoaded(e) { this.tableEvents = e; }

    constructor(private searchTermsSvc : EventSearchTermsService) {
    }

    ngOnInit(): void {
	this.searchTermsSvc.update(new SearchTerms([
	    {field: undefined, value: "mark-vm"}
	]));
    }

    ngAfterViewInit() : void {
    }

}

