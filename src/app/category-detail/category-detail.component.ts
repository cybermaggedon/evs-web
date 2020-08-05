import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import {
    EventSearchTermsService, SearchTerms
} from '../event-search-terms.service';
import { EventSourceService } from '../event-source.service';
import { age } from '../age';

@Component({
    selector: 'category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

    constructor(private route : ActivatedRoute,
		private location : Location,
 		private riskSvc : RiskService,
		private eventSvc : EventSourceService,
		private searchTermsSvc : EventSearchTermsService) {
    }

    // Current threat identifier
    id : string;

    // Risk model
    model : RiskModel;

    // Threats derived from risk model
    threats : Object;

    // Number of threats
    threatCount : number;

    // Number of events in the event table
    eventsTotal : number;

    // Called to update
    update() {

	if (this.id == undefined || this.model == undefined) return;

	let thr = [];

	let count = 0;

	
	for (let asset of this.model.devices) {
	    for (let risk of asset.risks) {
		if (risk.category == this.id) {
		    thr.push({
			"kind": "device",
			"id": asset.id,
			"age": age(risk.earliest)
		    });
		    count++;
		}
	    }
	}
	
	for (let asset of this.model.resources) {
	    for (let risk of asset.risks) {
		if (risk.category == this.id) {
		    thr.push({
			"kind": "resource",
			"id": asset.id,
			"age": age(risk.earliest)
		    });
		    count++;
		}
	    }
	}

        this.threats = thr;
        this.threatCount = count;

    }
    
    ngOnInit() : void {

    	this.riskSvc.subscribe(m => {
	    this.model = m;
	    this.update();
	});

	this.eventSvc.total.subscribe(t => {
	    console.log("TOTAL ", t);
	    this.eventsTotal = t;
	});

  	this.route.params.subscribe(res => {
	    this.id = res.id;
	    this.update();
            this.searchTermsSvc.update(new SearchTerms([
		{ field: undefined, value: this.id }
	    ]));
	})

    }

    goBack(): void {
	this.location.back();
    }

}
