import { Component, OnInit, Input } from '@angular/core';

import { EventSearchTermsService } from '../event-search-terms.service';

@Component({
    selector: 'event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

    constructor(private termsSvc: EventSearchTermsService) { }

    @Input("row")
    row : { key : string, value : string}[];

    ngOnInit(): void {
    }

    clicked(item) {
	this.termsSvc.add({ field: item.field, value: item.value });
	console.log("CLICKED: ", item);
    }

}
